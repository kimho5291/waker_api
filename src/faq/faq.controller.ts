import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { FaqService } from './faq.service';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as response from './dto/response';
import * as request from './dto/request';

@Controller('faq')
@ApiTags('faq')
export class FaqController {
  constructor(
		private service: FaqService,
	) {}

  @Post()
  @ApiOperation({ summary: 'faq 만들기' })
  @ApiOkResponse({type: response.FaqDto })
  async create(
    @Body() dto: request.CreateFaqDto
  ): Promise<response.FaqDto>{
    return await this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'faq 전체 조회' })
  @ApiOkResponse({type: response.FaqDto, isArray: true})
  async get(): Promise<response.FaqDto[]>{
    return await this.service.get();
  }

  @Get(':id')
  @ApiOperation({ summary: 'faq id로 조회' })
  @ApiOkResponse({type: response.FaqDto })
  async find(
    @Param('id') id: number
  ): Promise<response.FaqDto>{
    return await this.service.find(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'faq 수정' })
  @ApiOkResponse({type: response.FaqDto })
  async update(
    @Param('id') id: number,
    @Body() dto: request.CreateFaqDto
  ): Promise<response.FaqDto>{
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'faq 삭제' })
  @ApiNoContentResponse()
  async datele(
    @Param('id') id: number
  ){
    return await this.service.delete(id);
  }
}
