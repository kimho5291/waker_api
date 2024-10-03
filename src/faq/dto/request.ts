import { IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";

export class CreateFaqDto {
  @IsString()
  @ApiProperty({ description: '질문' })
  question: string;

  @IsNumber()
  @ApiProperty({ description: '응답' })
  answer: string;
}
