import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';
import * as response from './dto/response'
import * as request from './dto/request'
import { Response, Request } from 'express';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { IBaseFactory } from './oauth/oauth.factory';
import { UserSsoEntity } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private repository_u: Repository<UserEntity>,
    @InjectRepository(UserSsoEntity) private repository_us: Repository<UserSsoEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
		@InjectRedis() private redisClient: Redis,
  ){}

  async testLogin(res: Response): Promise<response.Token>{
    const user = await this.repository_u.findOne({where: {id: 1}});
    const access = await this.createAccess(user);
    const refresh = await this.createRefresh(user);

    const now = new Date();
    res.setHeader('Authorization', `Bearer ${access}`);
    res.cookie('refresh', {
      httpOnly: true,
      expiresIn: now.addSecond((await this.configService.getJwtConfig()).refresh_expire)
    })

    return {
      access_token: access,
      access_expiresIn: (await this.configService.getJwtConfig()).access_expire,
      refresh_token: refresh,
      refresh_expiresIn: (await this.configService.getJwtConfig()).refresh_expire,
    }
  }

  async login(user: UserEntity, res: Response): Promise<response.Token>{
    const access = await this.createAccess(user);
    const refresh = await this.createRefresh(user);

    const now = new Date();
    res.setHeader('Authorization', `Bearer ${access}`);
    res.cookie('refresh', {
      httpOnly: true,
      expiresIn: now.addSecond((await this.configService.getJwtConfig()).refresh_expire)
    })

    return {
      access_token: access,
      access_expiresIn: (await this.configService.getJwtConfig()).access_expire,
      refresh_token: refresh,
      refresh_expiresIn: (await this.configService.getJwtConfig()).refresh_expire,
    }
  }


  async createAccess(user: UserEntity): Promise<string>{
    const payload = {
      id: user.id,
      name: user.name,
      type: "access"
    }
    return await this.jwtService.signAsync(
      payload,
      {
        secret: (await this.configService.getJwtConfig()).access_secret,
        expiresIn: (await this.configService.getJwtConfig()).access_expire,
      }
    )
  }

  async createRefresh(user: UserEntity){
    const payload = {
      id: user.id,
      name: user.name,
      type: "refresh"
    }
    const token = await this.jwtService.signAsync(
      payload,
      {
        secret: (await this.configService.getJwtConfig()).refresh_secret,
        expiresIn: (await this.configService.getJwtConfig()).refresh_expire,
      }
    );

    await this.setWhiteList(payload.id, token);
    return token;
  }

  async setWhiteList(id: number, token: string){
    await this.redisClient.set(
      `whiteList:${id}:${token}`,
      1,
      'EX',
      (await this.configService.getJwtConfig()).refresh_expire
    );
  }

  async checkWhiteList(id: number, token: string){
    return (!!await this.redisClient.get(`whiteList:${id}:${token}`))
  }

  async signinByAuthCode(
    factory: IBaseFactory,
    code: string,
    req: Request,
    res: Response
  ): Promise<response.Token> {
    return this.signinByAccessToken(
      factory,
      await factory.getAccessTokenByOauthCode(code, req),
      res
    );
  }

  async signinByAccessToken(
    factory: IBaseFactory,
    token: string,
    res: Response
  ): Promise<response.Token> {
    const userInfo = await factory.getUserInfoByAccessToken(token);
    const user = await factory.findUser(userInfo.id);
    if (user === null) {
      const otherSso = await factory.findEmail(userInfo.email);
      if(otherSso == null) throw new BadRequestException({ access_token: token });
      else throw new ConflictException({provider_type: otherSso.ssos[0].provider_type})
    }
    return this.login(user, res);
  }

  async signupByAccessToken(
    factory: IBaseFactory,
    token: string,
    dto: request.CreateUserDto,
    res: Response
  ): Promise<response.Token> {
    const infoJson = await factory.getUserInfoByAccessToken(token);

    const newDto = Object.assign({}, dto, factory.getSsoInfo(infoJson));
    const user = await this.repository_u.save(newDto);
    this.repository_us.insert(
      user.ssos.map((o) =>
        Object.assign(o, {
          user_id: user.id,
        }),
      ),
    );

    return this.login(user, res);
  }

  async tokenRefresh(user: UserEntity, token: string, res: Response): Promise<response.Token> {
    // todo 회원 유효한지 검증
    if (!this.checkWhiteList(user.id, token)) throw new UnauthorizedException();
    const getUser = await this.repository_u.findOneOrFail({
      where: { id: user.id },
    });
    return this.login(getUser, res);
  }

}

