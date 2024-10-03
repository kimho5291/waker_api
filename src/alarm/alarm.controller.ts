import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as request from './dto/request';
import * as response from './dto/response';
import { User } from 'src/user/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('alarm')
@ApiTags('alarm')
export class AlarmController {
  constructor(
    private service: AlarmService
  ){}

  @Post()
  @ApiOperation({description: "알람 생성"})
  @ApiOkResponse({ type: response.AlarmDto})
  async create(
    @User() user: UserEntity,
    @Body() dto: request.CreateAlarmDto
  ){
    return await this.service.create(user, dto);
  }

  @Get()
  @ApiOperation({description: "알람 전체 조회(하위 알람 보이스 포함)"})
  @ApiOkResponse({ type: response.AlarmDto, isArray: true})
  async get(@User() user: UserEntity){
    return await this.service.get(user);
  }

  @Get(':alarm_id')
  @ApiOperation({description: "알람 개별 조회(하위 알람 보이스 포함)"})
  @ApiOkResponse({ type: response.AlarmDto})
  async find(
    @User() user: UserEntity,
    @Param('alarm_id') id: number,
  ){
    return await this.service.find(user, id);
  }

  @Put(':alarm_id')
  @ApiOperation({description: "알람 수정"})
  @ApiOkResponse({ type: response.AlarmDto})
  async update(
    @User() user: UserEntity,
    @Param('alarm_id') id: number,
    @Body() dto: request.CreateAlarmDto
  ){
    return await this.service.update(user, id, dto);
  }

  @Delete(':alarm_id')
  @ApiOperation({description: "알람 삭제"})
  @ApiNoContentResponse()
  async delete(
    @User() user: UserEntity,
    @Param('alarm_id') id: number,
  ){
    return await this.service.delete(user, id);
  }

  @Get(':alarm_id/voice/:voice_id')
  @ApiOperation({description: "알람 보이스 조회"})
  @ApiOkResponse({ type: response.AlarmVoiceDto})
  async findVoice(
    @User() user: UserEntity,
    @Param('alarm_id') alarm_id: number,
    @Param('voice_id') voice_id: number,
  ): Promise<response.AlarmVoiceDto>{
    return await this.service.findVoice(alarm_id, voice_id);
  }

  @Put(':alarm_id/voice/:voice_id')
  @ApiOperation({description: "알람 보이스 수정"})
  @ApiOkResponse({ type: response.AlarmDto})
  @UseInterceptors(FileInterceptor('file'))
  async updateVoice(
    @User() user: UserEntity,
    @Param('alarm_id') alarm_id: number,
    @Param('voice_id') voice_id: number,
    @UploadedFile() file: Express.Multer.File
  ){
    return await this.service.updateVoice(alarm_id, voice_id, file);
  }

  @Delete(':alarm_id/voice/:voice_id')
  @ApiOperation({description: "알람 보이스 삭제"})
  @ApiNoContentResponse()
  async deleteVoice(
    @User() user: UserEntity,
    @Param('alarm_id') alarm_id: number,
    @Param('voice_id') voice_id: number,
  ){
    return await this.service.deleteVoice(alarm_id, voice_id);
  }

}
