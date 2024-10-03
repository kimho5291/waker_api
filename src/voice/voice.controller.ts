import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { UserVoiceEntity } from './voice.entity';
import * as request from './dto/request';
import * as response from './dto/response';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';


@Controller('')
@ApiTags('voice')
export class VoiceController {
  constructor(
    private voiceService: VoiceService
  ){}

  @Get('voice')
  @ApiOperation({description: '학습 보이스 전체 조회'})
  @ApiOkResponse({type: response.UserVoiceDto, isArray: true})
  async get(
    @User() user: UserEntity
  ):Promise<response.UserVoiceDto[]>{
    return await this.voiceService.get(user);
  }

  @Get('voice/:voice_id')
  @ApiOperation({description: '학습 보이스 개별 조회'})
  @ApiOkResponse({type: response.UserVoiceDto})
  async find(
    @User() user: UserEntity,
    @Param('voice_id') voice_id: number
  ):Promise<response.UserVoiceDto>{
    return await this.voiceService.find(user, voice_id);
  }

  @Post('voice')
  @ApiOperation({description: '학습 보이스 생성'})
  @ApiOkResponse({type: response.UserVoiceDto})
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @User() user: UserEntity,
    @Body() dto: request.CreateVoiceDto,
    @UploadedFile() file: Express.Multer.File
  ):Promise<response.UserVoiceDto>{
    return await this.voiceService.create(user, dto, file);
  }

  @Put('voice/:voice_id')
  @ApiOperation({description: '학습 보이스 수정<br>multipart/multer로 보내면 되고 file은 2개 보내야함<br>1번은 선택한 header file, 2번은 생성된 intro file'})
  @ApiOkResponse({type: response.UserVoiceDto})
  @UseInterceptors(FilesInterceptor('file', 2))
  async update(
    @User() user: UserEntity,
    @Param('voice_id') voice_id: number,
    @Body() dto: request.UpdateVoiceDto,
    @UploadedFiles() files: Express.Multer.File[]
  ):Promise<response.UserVoiceDto>{
    return await this.voiceService.update(user, voice_id, files);
  }

  @Delete('voice/:voice_id')
  @ApiOperation({description: '학습 보이스 삭제'})
  @ApiNoContentResponse()
  async delete(
    @User() user: UserEntity,
    @Param('voice_id') voice_id: number
  ){
    return this.voiceService.delete(user, voice_id);
  }

  @Get('share')
  @ApiOperation({description: '공유 보이스 전체 조회'})
  @ApiOkResponse({type: response.VoiceShareDto, isArray: true})
  async getShare(
    @User() user: UserEntity
  ):Promise<response.VoiceShareDto[]>{
    return await this.voiceService.getShare(user);
  }

  @Get('share/:share_id')
  @ApiOperation({description: '공유 보이스 개별 조회'})
  @ApiOkResponse({type: response.VoiceShareDto})
  async findShare(
    @User() user: UserEntity,
    @Param('share_id') share_id: number,
  ):Promise<response.VoiceShareDto>{
    return await this.voiceService.findShare(user, share_id);
  }

  @Post('share')
  @ApiOperation({description: '공유 보이스 생성'})
  @ApiOkResponse({type: response.VoiceShareDto})
  async createShare(
    @User() user: UserEntity,
    @Body() dto: request.CreateShareDto
  ):Promise<response.VoiceShareDto>{
    return await this.voiceService.createShare(user, dto);
  }

  @Put('share/:share_id')
  @ApiOperation({description: '공유 보이스 수정'})
  @ApiOkResponse({type: response.VoiceShareDto})
  @UseInterceptors(FilesInterceptor('file'))
  async updateShare(
    @User() user: UserEntity,
    @Param('share_id') share_id: number,
    @Body() dto: request.UpdateShareDto,
    @UploadedFile() file: Express.Multer.File
  ):Promise<response.VoiceShareDto>{
    return await this.voiceService.updateShare(user, share_id, file);
  }

  @Delete('share/:share_id')
  @ApiOperation({description: '학습 보이스 삭제'})
  @ApiNoContentResponse()
  async deleteShare(
    @User() user: UserEntity,
    @Param('share_id') share_id: number
  ){
    return this.voiceService.deleteShare(user, share_id);
  }

  @Get('basic')
  @ApiOperation({description: '기본 보이스 전체 or type 조회'})
  @ApiOkResponse({type: response.BasicVoiceDto, isArray: true})
  async getBasic(
    @Query() dto: request.RetrieveBasicDto
  ):Promise<response.BasicVoiceDto[]>{
    return await this.voiceService.getBasic(dto);
  }

  @Get('basic/:basic_id')
  @ApiOperation({description: '기본 보이스 개별 or 랜덤 조회<br> rand를 넣으면 랜덤하게 하나 뽑아줌<br> 여기에 type을 넣으면 해당 타입 내에서 랜덤으로 해줌<br>아니면 해당 id에 맞는 basic voice 응답'})
  @ApiOkResponse({type: response.BasicVoiceDto})
  async findBasic(
    @Param('basic_id') basic_id: number,
    @Query() dto: request.RetrieveBasicRandDto
  ):Promise<response.BasicVoiceDto>{
    return await this.voiceService.findBasic(basic_id, dto);
  }

  @Post('basic')
  @ApiOperation({description: '기본 보이스 생성'})
  @ApiOkResponse({type: response.BasicVoiceDto})
  @UseInterceptors(FilesInterceptor('file'))
  async createBasic(
    @Body() dto: request.CreateBasicDto,
    @UploadedFile() file: Express.Multer.File
  ):Promise<response.BasicVoiceDto>{
    return await this.voiceService.createBasic(dto, file);
  }

  @Delete('basic/:basic_id')
  @ApiOperation({description: '기본 보이스 삭제'})
  @ApiNoContentResponse()
  async deleteBasic(
    @Param('basic_id') basic_id: number
  ){
    return this.voiceService.deleteBasic(basic_id);
  }

}
