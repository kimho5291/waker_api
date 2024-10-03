import { Body, Controller, Delete, Get, Put,  UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import * as response from './dto/response';
import * as request from './dto/request';
import { ApiOperation, ApiOkResponse, ApiTags, ApiNoContentResponse } from '@nestjs/swagger';
import { User } from './user.decorator';
import { UserEntity } from './user.entity';
import { AccessGuard } from 'src/auth/jwt.strategy';

@Controller('user')
@ApiTags('user')
@UseGuards(AccessGuard)
export class UserController {
  constructor(
		private service: UserService,
	) {}

  @Get()
  @ApiOperation({ summary: '유저 프로필 가져오기' })
  @ApiOkResponse({type: response.UserInfo })
  async get(@User() user: UserEntity): Promise<response.UserInfo>{
    return await this.service.get(user);
  }

  @Put()
  @ApiOperation({ summary: '유저 프로필 수정하기' })
  @ApiOkResponse({type: response.UserInfo })
  async update(
    @User() user: UserEntity,
    @Body() dto: request.UpdateDto
  ): Promise<response.UserInfo>{
    return await this.service.update(user, dto);
  }

  @Delete()
  @ApiOperation({ summary: '회원탈퇴' })
  @ApiNoContentResponse()
  async datele( @User() user: UserEntity ){
    return await this.service.delete(user);
  }

}
