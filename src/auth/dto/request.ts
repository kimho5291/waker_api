import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";

export class CreateDto {
  @IsString()
  @ApiProperty({ description: '이름' })
  name: string;

  @IsNumber()
  @ApiProperty({ description: '나이' })
  age: number;
}

export class Token {

  @IsString()
  @ApiProperty()
  access_token: string
}

export class CreateUserDto extends Token{
  @IsString()
  @ApiProperty({ description: 'TTS로 불릴 이름' })
  name: string;

  @IsBoolean()
  @Transform(({value}) => value == 1 || value == 'true' || value == "TRUE")
  @ApiProperty({ description: '성별' })
  sex: boolean;

  @IsString()
  @ApiProperty({ description: '생일' , example: "20010704"})
  birth: string;

  @IsBoolean()
  @Transform(({value}) => value == 1 || value == 'true' || value == "TRUE")
  @ApiProperty({ description: '선택 약관 동의' })
  agreement: boolean;
}

