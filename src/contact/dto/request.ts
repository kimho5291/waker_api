import { IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";

export class CreateContactDto {
  @IsString()
  @ApiProperty({ description: '질문' })
  title: string;

  @IsNumber()
  @ApiProperty({ description: '응답' })
  content: string;
}

export class CreateCommentDto {

  @IsNumber()
  @ApiProperty({ description: '응답' })
  comment: string;
}
