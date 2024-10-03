import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmEntity, AlarmVoiceEntity } from './alarm.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import * as request from './dto/request';
import { randomBytes } from 'crypto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class AlarmService {
	constructor(
		@InjectRepository(AlarmEntity) private repository_a: Repository<AlarmEntity>,
		@InjectRepository(AlarmVoiceEntity) private repository_av: Repository<AlarmVoiceEntity>,
		private storageService: StorageService
	){}

	async get(user: UserEntity): Promise<AlarmEntity[]>{
		return await this.repository_a.find({
			where: {user_id: user.id},
			relations: { alarm_voices: true }
		});
	}

	async find(user: UserEntity, id: number): Promise<AlarmEntity>{
		return await this.repository_a.findOneOrFail({
			where: {id: id, user_id: user.id},
			relations: { alarm_voices: true }
		})
	}

	async create(user: UserEntity, dto: request.CreateAlarmDto): Promise<AlarmEntity>{
		const alarm = Object.assign({}, {
			user_id: user.id,
			specific_date: null
		}, dto);

		const re = {
      ...{
        id: (await this.repository_a.insert(alarm)).raw?.insertId,
      },
      ...alarm,
    };

		await this.createVoice(re.id);

		return re;
	}

	async update(user: UserEntity, id: number, dto: request.CreateAlarmDto): Promise<AlarmEntity>{
		const alarm = Object.assign(
			{id: id, user_id: user.id},
			dto
		);
		return await this.repository_a.save(alarm);
	}

	async delete(user: UserEntity, id: number){
		if((await this.repository_a.softDelete({id: id, user_id: user.id})).affected == 0){
      throw new NotFoundException();
    }
	}

	async createVoice(alarm_id: number): Promise<AlarmVoiceEntity>{
		const voice = {alarm_id: alarm_id};
		const re = {
      ...{
        id: (await this.repository_av.insert(voice)).raw?.insertId,
      },
      ...voice,
    };

		/**
		 * TO-DO
		 * 알람이 설정되면 알람 생성 queue를 생성해야한다.
		 * queue에다 넣으면 무조건 제작하는 곳에 들어갈테니깐
		 * pub-sub로 할지 고민중 아니면 -> redis 사용하면 부하가 제일 적을 것으로 예상
		 * 30초마다 cron으로 돌면서 확인하던가 해야함 -> 없어도 돌아야하니깐 뭐 상관 없나 ?
		 * 그래야 ai를 통해서 음성을 제작하던 음성을 편집하던 할 테니깐
		 */


		return re;
	}

	async updateVoice(alarm_id: number, voice_id: number, file: Express.Multer.File): Promise<AlarmVoiceEntity>{
		const path= `waker-bucket/alarm/${alarm_id}/voice/${voice_id}`;
		const name = `${randomBytes(20).toString('hex')}.${file.mimetype.split("/")[1]}`;
		const alarm_path = await this.storageService.upload(path, name, file);
		const alarm = Object.assign(
			{id: voice_id, alarm_id: alarm_id, path: alarm_path},
		);
		return await this.repository_av.save(alarm);
	}

	async findVoice(alarm_id: number, voice_id: number): Promise<AlarmVoiceEntity>{
		return await this.repository_av.findOneOrFail({where: {alarm_id: alarm_id, id: voice_id}})
	}

	async deleteVoice(alarm_id: number, voice_id: number){
		if((await this.repository_av.softDelete({id: voice_id, alarm_id: alarm_id})).affected == 0){
      throw new NotFoundException();
    }

		/**
		 * TO-DO
		 * S3에서 파일 삭제?
		 * 할지말지는 고민해봐야할듯?
		 * 시퀀스 상 알람이 울리고나면(User가 다운로드 완료하면 -> CDN에서 처리가 가능한가?) 삭제하는게 맞긴함
		 */
	}
	
}

