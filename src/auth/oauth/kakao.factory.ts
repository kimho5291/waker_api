import { Inject, Injectable } from "@nestjs/common";
import { BaseFactory, OauthType, TokenInfo } from "./oauth.factory";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "src/config/config.service";
import { HttpService } from "@nestjs/axios";
import { catchError, lastValueFrom, map } from "rxjs";
import { stringify } from "querystring";

@Injectable()
export class KakaoFactory extends BaseFactory{
  constructor(
    @InjectRepository(UserEntity) repository: Repository<UserEntity>,
    private configService: ConfigService,
    private httpService: HttpService
  ){
    super(OauthType.KAKAO, repository);
  }

  async getAccessTokenByOauthCode(code: string, req: Request): Promise<string> {
    const config = (await this.configService.getSsoConfig()).kakao

    const oauthBody = stringify({
      client_id: config.client_id,
      grant_type: 'authorization_code',
      redirect_uri: encodeURI(`${req.protocol}://${req.get('host')}${req.path}`),
      code: code,
    })

    const res = await lastValueFrom(
      this.httpService.post(`https://kauth.kakao.com/oauth/token`, oauthBody).pipe(
        map(response => response?.data),
        catchError(error => { throw new Error(`kakao oauth fail : ${error}`) })
      )
    )

    return res.access_token;
  }

  async getUserInfoByAccessToken(token: string): Promise<TokenInfo> {
    const user = await lastValueFrom(
      this.httpService.get(`https://kapi.kakao.com/v1/oidc/userinfo`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }).pipe(
        map(response => response?.data),
        catchError(error => { throw new Error(`kakao oauth fail : ${error}`) })
      )
    )

    return {
      id: user.sub,
      email: user.email
    }
  }
}