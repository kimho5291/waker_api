import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as response from './dto/response';
import * as request from './dto/request';
import { UserEntity } from 'src/user/user.entity';
import { randomBytes } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class StorageService {
  private s3Client: AWS.S3;

  constructor(
    private httpService: HttpService
  ){
    this.s3Client = new AWS.S3({
      region: process.env.IAM_REGION,
      accessKeyId: process.env.IAM_ACCESS_KEY_ID,
      secretAccessKey: process.env.IAM_SECRET_ACCESS_KEY,
    });
  }

  async testUpload(user: UserEntity, id: number, file: Express.Multer.File){
    const path = `waker-bucket/user/${user.id}/voice/${id}`;
    const name = `${randomBytes(20).toString('hex')}.${file.mimetype.split("/")[1]}`;
    return (await this.upload(path, name, file)).split("?")[0];
  }

  async upload(path: string, name:string, file: Express.Multer.File){
    const url = await this.createPutUrl(path, name, file);
    await lastValueFrom(
        this.httpService.put(url, file.buffer).pipe(
            map(response => response?.data),
            catchError(error => { throw new Error(`upload file fail : ${error}`) })
        )
    )
    return url;
  }

  async createPutUrl(path: string, name:string, file: Express.Multer.File): Promise<string>{
    const params = {
      Bucket: path,
      Key: name,
      Expires: 600,
      ContentType: file.mimetype,
      ACL: 'public-read',
    }
    return await this.s3Client.getSignedUrlPromise('putObject', params)
  }

  async createPreSignedURL(user: UserEntity, dto: request.CreateSignedURLDto): Promise<response.preSignedUrl>{
    const extension = dto.contentType.split("/")[1];
    const params = {
      Bucket: `waker-bucket/user/${user.id}`,
      Key: `${dto.fileName}.${extension}`,
      Expires: 600,
      ContentType: dto.contentType,
      ACL: 'public-read',
    }

    return {
      fileName: `${dto.fileName}.${extension}`,
      preSignedUrl: await this.s3Client.getSignedUrlPromise('putObject', params)
    }
  }
}
