import { ApiProperty } from '@nestjs/swagger';

export interface ApiConfig{
  weather: string;
  news: string;
}

export interface Jwt {
  access_secret: string;
  refresh_secret: string;
  access_expire: number;
  refresh_expire: number;
}

export interface SsoConfig {
  kakao: SSoDetailConfig;
  naver: SSoDetailConfig;
  google: SSoDetailConfig;
  
}

export interface SSoDetailConfig {
  client_id: string;
  secret: string;
}

export interface AppleDetailConfig {
  client_id: string;
  team_id: string;
  key_id: string;
  private_key: string;
}


export class AppInfo {
  @ApiProperty({ description: 'APP Version' , example: "1.0.1"})
  version: string;

  @ApiProperty({ description: '약관' , type: () =>Terms, isArray: true})
  terms: Terms[];
}

export class Terms {
  @ApiProperty({ description: 'term Id' , example: "1"})
  id: number;

  @ApiProperty({ description: 'term Title' , example: "서비스 이용약관"})
  title: string;

  @ApiProperty({ description: 'term Content' , example: "해당 내용은 ~~~"})
  content: string;

  @ApiProperty({ description: 'term Required' , example: true})
  required: boolean;
}