import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as response from './dto/response';
import * as request from './dto/request';

@Controller('notice')
@ApiTags('notice')
export class NoticeController {
  constructor(
    private service: NoticeService
  ){}

  @Post()
  @ApiOperation({ summary: '공지사항 만들기' })
  @ApiOkResponse({type: response.NoticeDto })
  async create(
    @Body() dto: request.CreateNoticeDto
  ): Promise<response.NoticeDto>{
    return await this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '공지사항 전체 조회' })
  @ApiOkResponse({type: response.NoticeDto, isArray: true})
  async get(): Promise<response.NoticeDto[]>{
    return await this.service.get();
  }

  @Get(':id')
  @ApiOperation({ summary: '공지사항 id로 조회' })
  @ApiOkResponse({type: response.NoticeDto })
  async find(
    @Param('id') id: number
  ): Promise<response.NoticeDto>{
    return await this.service.find(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '공지사항 수정' })
  @ApiOkResponse({type: response.NoticeDto })
  async update(
    @Param('id') id: number,
    @Body() dto: request.CreateNoticeDto
  ): Promise<response.NoticeDto>{
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '공지사항 삭제' })
  @ApiNoContentResponse()
  async datele(
    @Param('id') id: number
  ){
    return await this.service.delete(id);
  }
}
