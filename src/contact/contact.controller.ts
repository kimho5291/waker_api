import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as response from './dto/response';
import * as request from './dto/request';
import { User } from 'src/user/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { AccessGuard } from 'src/auth/jwt.strategy';

@Controller('contact')
@ApiTags('contact')
@UseGuards(AccessGuard)
export class ContactController {
  constructor(
    private service: ContactService
  ){}

  @Post()
  @ApiOperation({ summary: '문의사항 생성' })
  @ApiOkResponse({type: response.ContactDto
   })
  async create(
    @User() user: UserEntity,
    @Body() dto: request.CreateContactDto
  ): Promise<response.ContactDto>{
    return await this.service.create(user, dto);
  }

  @Get()
  @ApiOperation({ summary: '문의사항 전체 조회(답글 포함)' })
  @ApiOkResponse({type: response.ContactDto, isArray: true})
  async get(): Promise<response.ContactDto[]>{
    return await this.service.get();
  }

  @Get(':id')
  @ApiOperation({ summary: '문의사항 개별 조회(답글 포함)' })
  @ApiOkResponse({type: response.ContactDto })
  async find(
    @Param('id') id: number
  ): Promise<response.ContactDto>{
    return await this.service.find(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '문의사항 수정' })
  @ApiOkResponse({type: response.ContactDto })
  async update(
    @Param('id') id: number,
    @Body() dto: request.CreateContactDto
  ): Promise<response.ContactDto>{
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '문의사항 삭제' })
  @ApiNoContentResponse()
  async datele(
    @Param('id') id: number
  ){
    return await this.service.delete(id);
  }
  
  @Post(':id/comment')
  @ApiOperation({ summary: '문의사항 답글 생성' })
  @ApiOkResponse({type: response.CommentDto
   })
  async createComment(
    @Param('id') id: number,
    @Body() dto: request.CreateCommentDto,
  ): Promise<response.CommentDto>{
    return await this.service.createComment(id, dto);
  }

  @Put(':id/comment/:comment_id')
  @ApiOperation({ summary: '문의사항 답글 수정' })
  @ApiOkResponse({type: response.CommentDto
   })
  async updateComment(
    @Param('id') id: number,
    @Param('comment_id') comment_id: number,
    @Body() dto: request.CreateCommentDto,
  ): Promise<response.CommentDto>{
    return await this.service.updateComment(id, dto);
  }

  @Delete(':id/comment/:comment_id')
  @ApiOperation({ summary: '문의사항 삭제' })
  @ApiNoContentResponse()
  async dateleComment(
    @Param('comment_id') comment_id: number,
  ){
    return await this.service.deleteComment(comment_id);
  }

}
