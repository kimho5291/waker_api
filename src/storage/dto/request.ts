import { IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateSignedURLDto {
  @IsString()
  @ApiProperty({ description: '파일명' })
  fileName: string;

  @IsString()
  @ApiProperty({ description: '파일 컨텐츠 타입' })
  contentType: string;
}
