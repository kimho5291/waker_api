import { ApiProperty } from '@nestjs/swagger';

export class UserInfo {

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  sex: boolean;

  @ApiProperty()
  birth: string;

  @ApiProperty()
  agreement: boolean;

  @ApiProperty()
  created_at?: Date;
}