import { Injectable } from "@nestjs/common";
import { BaseFactory, OauthType, TokenInfo } from "./oauth.factory";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "src/config/config.service";
import { HttpService } from "@nestjs/axios";
import { catchError, lastValueFrom, map } from "rxjs";
import { stringify } from "querystring";
import { verify } from "jsonwebtoken";

@Injectable()
export class GoogleFactory extends BaseFactory{
  private keys: Record<string, string> = {}
  constructor(
    @InjectRepository(UserEntity) repository: Repository<UserEntity>,
    private configService: ConfigService,
    private httpService: HttpService
  ){
    super(OauthType.GOOGLE, repository);
  }
  async getAccessTokenByOauthCode(code: string, req: Request): Promise<string> {
    const config = (await this.configService.getSsoConfig()).google

    const oauthBody = stringify({
      client_id: config.client_id,
      client_secret: config.secret,
      grant_type: 'authorization_code',
      redirect_uri: encodeURI(`${req.protocol}://${req.get('host')}${req.path}`),
      code: code,
    })

    const res = await lastValueFrom(
      this.httpService.post(`https://oauth2.googleapis.com/token`, oauthBody).pipe(
        map(response => response?.data),
        catchError(error => { throw new Error(`google oauth fail : ${error}`) })
      )
    )

    return res.id_token;
  }
  async getUserInfoByAccessToken(token: string): Promise<TokenInfo> {
    const tokenHeader = JSON.parse(atob(token.split('.')[0]))
    const key = await this.getKey(tokenHeader.kid)
    const tokenPayload = verify(token, key)
    return {
      id: tokenPayload.sub as string,
      email : tokenPayload["email"] as string
    };
  }

  private async getKey(kid: string) {
    if (kid in this.keys) return this.keys[kid]

    this.keys = await lastValueFrom(
      this.httpService.get(`https://www.googleapis.com/oauth2/v1/certs`).pipe(
        map(response => response?.data),
        catchError(error => { throw new Error(`google oauth fail : ${error}`) })
      )
    )
    return this.keys[kid];
  }

}