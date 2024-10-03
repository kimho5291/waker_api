import { IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from "class-transformer";

export class CreateAlarmDto {
  @IsNumber()
  @ApiProperty({ description: '보이스 ID' })
  voice_id: number;

  @IsString()
  @ApiProperty({ description: '이름' })
  name: string;

  @IsNumber()
  @ApiProperty({ description: '요일(BIT MASK)' })
  days: number;

  @IsString()
  @ApiProperty({ description: '알람 시간', example: "0718 => 7시 18분" })
  time: string;

  @IsString()
  @ApiProperty({ description: '알람 특정 일자', example: "20240809, 특정일자가 아니면 생략해도 됨" })
  specific_date?: string;

  @IsBoolean()
  @Transform(({ value }) => value == 1 || value == 'true' || value == 'TRUE')
  @ApiProperty({ description: '알람 활성화 여부', example: "1 or 0 or true or false"})
  is_active: Boolean;

  @IsBoolean()
  @Transform(({ value }) => value == 1 || value == 'true' || value == 'TRUE')
  @ApiProperty({ description: '공휴일 활성화 여부', example: "1 or 0 or true or false"})
  is_weekend: Boolean;

  @IsNumber()
  @ApiProperty({ description: '볼륨 크기', example: "0 ~ 100"})
  volum: number;

  @IsBoolean()
  @Transform(({ value }) => value == 1 || value == 'true' || value == 'TRUE')
  @ApiProperty({ description: '진동 여부', example: "1 or 0 or true or false"})
  vibrate: Boolean;

  @IsNumber()
  @ApiProperty({ description: '관심사 (BIT MASK)'})
  interest: number;
}

export class UpdateVoiceDto{
  @ApiProperty({ type: () => 'string', format: 'binary' })
  file: Express.Multer.File
}