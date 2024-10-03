import { IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";

export class CreateDto {
  @IsString()
  @ApiProperty({ description: '이름' })
  readonly name: string;

  @IsNumber()
  @ApiProperty({ description: '나이' })
  readonly age: number;
}

export class UpdateDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '이름' })
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value != 0 && !!value && value !== 'true' && value !== 'TRUE')
  @ApiProperty({ description: '성별' })
  sex: Boolean;

  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  @ApiProperty({ description: '나이' })
  birth: string;
}