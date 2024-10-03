import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeEntity } from './notice.entity';
import { Repository } from 'typeorm';
import * as request from './dto/request';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity) private repository: Repository<NoticeEntity>
  ){}

  async create(dto: request.CreateNoticeDto): Promise<NoticeEntity>{
		return {
      ...{
        id: (await this.repository.insert(dto)).raw?.insertId,
      },
      ...dto,
    };
	}

	async get(): Promise<NoticeEntity[]>{
		return await this.repository.find();
	}

	async find(id: number): Promise<NoticeEntity>{
		return await this.repository.findOne({where: {id: id}});
	}

	async update(id: number, dto: request.CreateNoticeDto): Promise<NoticeEntity>{
		const faq = Object.assign(dto, {id: id});
		return await this.repository.save(faq);
	}

	async delete(id: number){
		if((await this.repository.softDelete({id: id})).affected == 0){
      throw new NotFoundException();
    }
	}
}
