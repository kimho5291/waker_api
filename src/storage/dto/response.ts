import { ApiProperty } from '@nestjs/swagger';

export class preSignedUrl{

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  preSignedUrl: string;

}