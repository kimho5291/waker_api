import { ApiProperty } from '@nestjs/swagger';

export class UserVoiceDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  origin_path: string;

  @ApiProperty()
  header_path?: string;

  @ApiProperty()
  intro_path?: string;

  @ApiProperty()
  created_at?: Date;

  @ApiProperty()
  updated_At?: Date;
}

export class VoiceShareDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  voice_id: number;
    
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  intro_path?: string;

  @ApiProperty()
  created_at?: Date;

  @ApiProperty()
  updated_At?: Date;
}

export class BasicVoiceDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
    
  @ApiProperty()
  type: number;

  @ApiProperty()
  path: string;

  @ApiProperty()
  created_at?: Date;
}

