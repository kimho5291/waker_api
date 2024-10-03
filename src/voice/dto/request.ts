import { IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";

export class RetrieveBasicDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '관심사 타입', required: false})
  type?: number;
}

export class RetrieveBasicRandDto {

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '관심사 타입', required: false})
  type?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({value}) => value == 1 || value == 'true' || value == 'TRUE')
  @ApiProperty({ description: '랜덤 1개 조회 여부', required: false})
  rand?: boolean;
}

export class CreateVoiceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '이름' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({type: () => 'string', format: 'binary' })
  file: Express.Multer.File
}

export class UpdateVoiceDto {

  @IsNotEmpty()
  @ApiProperty({isArray: true, type: () => 'string', format: 'binary' })
  files: Express.Multer.File[]
}

export class CreateBasicDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '이름' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '흥미 타입' })
  type: number;

  @ApiProperty({ type: () => 'string', format: 'binary' })
  file: Express.Multer.File
}

export class CreateShareDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '이름' })
  voice_code: string;
}

export class UpdateShareDto {

  @IsNotEmpty()
  @ApiProperty({ type: () => 'string', format: 'binary' })
  file: Express.Multer.File
}