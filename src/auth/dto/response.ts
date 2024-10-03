import { ApiProperty } from '@nestjs/swagger';

export class Token {

  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  access_expiresIn: number;

  @ApiProperty()
  refresh_expiresIn: number;
}

export class RequiredSignup {
  @ApiProperty()
  access_token: string
}

export class SsoExisted {
  @ApiProperty()
  provider_type: number
}