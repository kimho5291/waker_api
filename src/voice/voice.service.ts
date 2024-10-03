import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicAlarmVoiceEntity, UserVoiceEntity, UserVoiceShareEntity, Interest } from './voice.entity';
import { Repository } from 'typeorm';
import * as request from './dto/request';
import { StorageService } from 'src/storage/storage.service';
import { randomBytes } from 'crypto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class VoiceService {
  constructor(  
    @InjectRepository(UserVoiceEntity) private repository_v: Repository<UserVoiceEntity>,
    @InjectRepository(UserVoiceShareEntity) private repository_vs: Repository<UserVoiceShareEntity>,
    @InjectRepository(BasicAlarmVoiceEntity) private repository_bav: Repository<BasicAlarmVoiceEntity>,
    private storageService: StorageService
  ){}

  async get(user: UserEntity): Promise<UserVoiceEntity[]>{
    return await this.repository_v.find({where: {user_id: user.id}});
  }

  async find(user: UserEntity, voice_id: number): Promise<UserVoiceEntity>{
    return await this.repository_v.findOneOrFail({
      where: {
        id: voice_id,
        user_id: user.id
      }
    });
  }

  async create(user: UserEntity, dto: request.CreateVoiceDto, file: Express.Multer.File): Promise<UserVoiceEntity>{
    const voice_code = `${randomBytes(10).toString('hex')}_${user.id}` ;
    const path = `waker-bucket/user/${user.id}/voice/${voice_code}`;
		const name = `${randomBytes(20).toString('hex')}.${file.mimetype.split("/")[1]}`;
		const origin_path = await this.storageService.upload(path, name, file);
    const voice = Object.assign(dto, {
      user_id: user.id, 
      voice_code: voice_code,
      origin_path: origin_path
    })

    const re = {
      ...{
        id: (await this.repository_v.insert(voice)).raw?.insertId,
      },
      ...voice,
    };

    /**
     * TO-DO
     * AI 서버로 적합한 header 찾는 것과 header를 찾으면 intro 음성을 만들라는 요청 보내야함
     * 2개 따로 받는 걸로
     * 
     */

    return re;
  }

  async update(user: UserEntity, id:number, files: Express.Multer.File[]): Promise<UserVoiceEntity>{
    const voice = await this.repository_v.findOne({where: {id: id}})
    const path = `waker-bucket/user/${user.id}/voice/${voice.voice_code}`;
    const paths = files.map(async (e) => {
      const name = `${randomBytes(20).toString('hex')}.${e.mimetype.split("/")[1]}`;
		  return await this.storageService.upload(path, name, e);
    })
    const updatedVoice = Object.assign(voice, {
      header_path: paths[0],
      intro_path: paths[1]
    });
    return await this.repository_v.save(updatedVoice);
  }

  async delete(user: UserEntity, id: number){
    if((await this.repository_v.softDelete({id: id, user_id: user.id})).affected == 0){
      throw new NotFoundException();
    }

    /**
		 * TO-DO
		 * S3에서 파일 삭제 구현?
     * 여기서 삭제하면 연쇄적으로 이미 만들어진 알람도 싹다 지워야하는 불상사 발생 -> 고민고민
		 */
  }

  async getShare(user: UserEntity): Promise<UserVoiceShareEntity[]>{
    return await this.repository_vs.find({
      where: {user_id: user.id},
      relations: {voice: true}
    })
  }

  async findShare(user: UserEntity, id: number): Promise<UserVoiceShareEntity>{
    return await this.repository_vs.findOneOrFail({
      where: {user_id: user.id, id: id},
      relations: {voice: true}
    })
  }

  async createShare(user: UserEntity, dto: request.CreateShareDto): Promise<UserVoiceShareEntity>{
    const voice = await this.repository_v.findOne({where: {voice_code: dto.voice_code}});
    if(!voice) throw new NotFoundException("초대 보이스 코드를 확인해주세요");
    const share = { user_id: user.id, voice_id: voice.id };
    return {
      ...{
        id: (await this.repository_vs.insert(share)).raw?.insertId,
      },
      ...share,
    };
  }

  async updateShare(user: UserEntity, id: number, file: Express.Multer.File): Promise<UserVoiceShareEntity>{
    const path = `waker-bucket/user/${user.id}/share/`;
		const name = `${randomBytes(20).toString('hex')}.${file.mimetype.split("/")[1]}`;
		const intro_path = await this.storageService.upload(path, name, file);
    const newShare = Object.assign({id: id, intro_path: intro_path});
    return await this.repository_vs.save(newShare);
  }

  async deleteShare(user: UserEntity, id: number){
    if((await this.repository_vs.softDelete({id: id, user_id: user.id})).affected == 0){
      throw new NotFoundException();
    }
  }



  async getBasic(dto: request.RetrieveBasicDto): Promise<BasicAlarmVoiceEntity[]>{
    if(dto.type){
      return await this.repository_bav.find({where: {type: dto.type}});
    }
    return await this.repository_bav.find();
  }

  async findBasic(id: number, dto: request.RetrieveBasicRandDto): Promise<BasicAlarmVoiceEntity>{
    if(dto.rand){
      if(dto.type) return await this.findBasicRandWithType(dto.type)
      else return await this.findBasicRand()
    }

    return await this.repository_bav.findOneOrFail({where: { id: id }});
  }

  async findBasicRandWithType(type: number): Promise<BasicAlarmVoiceEntity>{
    return await this.repository_bav.createQueryBuilder('basic')
      .where("basic.type=:type", {type: type})
      .orderBy('RAND()')
      .limit(1)
      .getOne();
  }

  async findBasicRand(): Promise<BasicAlarmVoiceEntity>{
    return await this.repository_bav.createQueryBuilder('basic')
      .orderBy('RAND()')
      .limit(1)
      .getOne();
  }

  async createBasic(dto: request.CreateBasicDto, file: Express.Multer.File): Promise<BasicAlarmVoiceEntity>{
    const path = `waker-bucket/basicvoice`;
		const name = `${randomBytes(20).toString('hex')}.${file.mimetype.split("/")[1]}`;
		const basicPath = await this.storageService.upload(path, name, file);
    const basic = Object.assign(dto, {path: basicPath});
    return {
      ...{
        id: (await this.repository_bav.insert(basic)).raw?.insertId,
      },
      ...basic,
    };
  }

  async deleteBasic(id: number){
    if((await this.repository_bav.softDelete({id: id})).affected == 0){
      throw new NotFoundException();
    }

    /**
		 * TO-DO
		 * S3에서 파일 삭제 구현
		 */
  }


}
