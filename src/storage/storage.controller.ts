import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as response from './dto/response';
import * as request from './dto/request';
import { UserEntity } from 'src/user/user.entity';
import { User } from 'src/user/user.decorator';
import { AccessGuard } from 'src/auth/jwt.strategy';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('storage')
@ApiTags('storage')
@UseGuards(AccessGuard)
export class StorageController {
  constructor(
    private service: StorageService
  ){}

  @Post()
  @ApiOperation({ 
    summary: 'preSignedUrl 가져오기',
    description: 'fileName은 확장자없이 순수 이름만<br>contentType은 MIME 타입을 넣으면 됨'
  })
  @ApiOkResponse({type: response.preSignedUrl })
  async get(
    @User() user: UserEntity,
    @Body() dto: request.CreateSignedURLDto 
  ): Promise<response.preSignedUrl>{
    return await this.service.createPreSignedURL(user, dto);
  }

  @Post(':id')
  @ApiOperation({ 
    summary: '파일 업로드하기',
    description: 'multipart/multer'
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @User() user: UserEntity,
    @Param('id') id:number, 
    @UploadedFile() file: Express.Multer.File
  ){
    return await this.service.testUpload(user, id, file);
  }
}
