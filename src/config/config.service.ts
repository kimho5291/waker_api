import { Injectable } from '@nestjs/common';
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as config from './dto/config'
import { RedisModuleOptions } from '@nestjs-modules/ioredis';

@Injectable()
export class ConfigService {
  client: SSMClient
  cache: Record<string, any> = {}

  constructor() {
    const ssmClientConfig = {
      region: process.env.IAM_REGION,
      credentials: {
        accessKeyId: process.env.IAM_ACCESS_KEY_ID,
        secretAccessKey: process.env.IAM_SECRET_ACCESS_KEY,
      },
    };

    this.client = new SSMClient(ssmClientConfig);
  }

  async getDatabaseConfig(): Promise<MysqlConnectionOptions> {
    return await this.getValue('database');
  }

  async getJwtConfig(): Promise<config.Jwt> {
    return await this.getValue('jwt');
  }

  async getSsoConfig(): Promise<config.SsoConfig> {
    return await this.getValue('sso');
  }

  async getApiConfig(): Promise<config.ApiConfig> {
    return await this.getValue('api');
  }

  async getRedisConfig(): Promise<RedisModuleOptions> {
    return await this.getValue('redis');
  }

  async getAppInfo(): Promise<config.AppInfo> {
    return await this.getValue('appInfo');
  }


  async getValueRaw(name: string): Promise<any> {
    if (name in this.cache) {
      return this.cache[name]
    }
    
    const response = await this.client.send(new GetParameterCommand({
      Name: `/waker/${process.env.NODE_ENV}/${name}`,
      WithDecryption: true,
    }))

    return response.Parameter.Value
  }

  async getValue(name: string): Promise<any> {
    return JSON.parse(await this.getValueRaw(name))
  }
}
