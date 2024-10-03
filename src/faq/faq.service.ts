import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FaqEntity } from './faq.entity';
import { Repository } from 'typeorm';
import * as request from './dto/request';

@Injectable()
export class FaqService {
	constructor(
    @InjectRepository(FaqEntity) private repository: Repository<FaqEntity>
	){}

	async create(dto: request.CreateFaqDto): Promise<FaqEntity>{
		return {
      ...{
        id: (await this.repository.insert(dto)).raw?.insertId,
      },
      ...dto,
    };
	}

	async get(): Promise<FaqEntity[]>{
		return await this.repository.find();
	}

	async find(id: number): Promise<FaqEntity>{
		return await this.repository.findOne({where: {id: id}});
	}

	async update(id: number, dto: request.CreateFaqDto): Promise<FaqEntity>{
		const faq = Object.assign(dto, {id: id});
		return await this.repository.save(faq);
	}

	async delete(id: number){
		if((await this.repository.softDelete({id: id})).affected == 0){
      throw new NotFoundException();
    }
	}
}
