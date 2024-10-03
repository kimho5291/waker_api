import { Injectable } from "@nestjs/common";
import { BaseFactory, OauthType, TokenInfo } from "./oauth.factory";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "src/config/config.service";
import { HttpService } from "@nestjs/axios";
import { stringify } from "querystring";
import { catchError, lastValueFrom, map } from "rxjs";


@Injectable()
export class NaverFactory extends BaseFactory{
  constructor(
    @InjectRepository(UserEntity) repository: Repository<UserEntity>,
    private configService: ConfigService,
    private httpService: HttpService
  ){
    super(OauthType.NAVER, repository);
  }

  async getAccessTokenByOauthCode(code: string, req: Request): Promise<string> {
    const config = (await this.configService.getSsoConfig()).naver
    
    const oauthBody = stringify({
      client_id: config.client_id,
      client_secret: config.secret,
      grant_type: 'authorization_code',
      redirect_uri: encodeURI(`${req.protocol}://${req.get('host')}${req.path}`),
      code: code,
    })

    const res = await lastValueFrom(
      this.httpService.post(`https://nid.naver.com/oauth2.0/token`, oauthBody).pipe(
        map(response => response?.data),
        catchError(error => { throw new Error(`naver oauth fail : ${error}`) })
      )
    )

    return res.access_token;
  }
  async getUserInfoByAccessToken(token: string): Promise<TokenInfo> {
    const user = await lastValueFrom(
      this.httpService.get(`https://openapi.naver.com/v1/nid/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }).pipe(
        map(response => response?.data),
        catchError(error => { throw new Error(`naver oauth fail : ${error}`) })
      )
    )

    return {
      id: user.response.id,
      email: user.response.email
    };
  }

}