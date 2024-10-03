import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import * as request from '../dto/request';
import { Request } from "express";

export enum OauthType{
  KAKAO= 0,
  NAVER,
  GOOGLE,
  APPLE,
}

export class CreateSsoDto extends request.CreateUserDto{
  email: string
}

export interface TokenInfo{
  id: string,
  email: string
}

export interface TokenProv{
  provider_type: OauthType,
  provider_user_id: string,
}

export interface IBaseFactory{
  findUser(id: string): Promise<UserEntity>,
  findEmail(email: string): Promise<UserEntity>,
  getSsoInfo(info: TokenInfo): TokenProv,
  getAccessTokenByOauthCode(code: string, req: Request): Promise<string>,
  getUserInfoByAccessToken(token:string): Promise<TokenInfo>
}

export abstract class BaseFactory implements IBaseFactory{
  constructor(
    private type: OauthType,
    private repository: Repository<UserEntity>
  ){}

  async findUser(id: string): Promise<UserEntity>{
    return await this.repository.findOne({
      where: {ssos: {
        provider_user_id: id,
        provider_type: this.type,
      }},
      relations: {ssos: true}
    })
  }

  async findEmail(email: string): Promise<UserEntity>{
    return await this.repository.findOne({
      where: {email: email}
    })
  }

  getSsoInfo(info: TokenInfo): TokenProv{
    return {
      provider_type: this.type,
      provider_user_id: info.id,
    }
  }

  abstract getAccessTokenByOauthCode(code: string, req: Request): Promise<string>;
  abstract getUserInfoByAccessToken(token:string): Promise<TokenInfo>;
}