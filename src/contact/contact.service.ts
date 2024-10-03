import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserContactCommentEntity, UserContactEntity } from './contact.entity';
import { Repository } from 'typeorm';
import * as request from './dto/request';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(UserContactEntity) private repository_c: Repository<UserContactEntity>,
    @InjectRepository(UserContactCommentEntity) private repository_cc: Repository<UserContactCommentEntity>
  ){}


  async create(user: UserEntity, dto: request.CreateContactDto): Promise<UserContactEntity>{
		const body = Object.assign(dto, {user_id: user.id});
    return {
      ...{
        id: (await this.repository_c.insert(body)).raw?.insertId,
      },
      ...body,
    };
	}

	async get(): Promise<UserContactEntity[]>{
		return await this.repository_c.find({
      relations: {comment: true}
    });
	}

	async find(id: number): Promise<UserContactEntity>{
		return await this.repository_c.findOne({
      where: {id: id},
      relations: {comment: true}
    });
	}

	async update(id: number, dto: request.CreateContactDto): Promise<UserContactEntity>{
		const body = Object.assign(dto, {id: id});
		return await this.repository_c.save(body);
	}

	async delete(id: number){
		if((await this.repository_c.softDelete({id: id})).affected == 0){
      throw new NotFoundException();
    }
	}
  
  async findComment(id: number): Promise<UserContactCommentEntity>{
		return await this.repository_cc.findOne({
      where: {id: id},
    });
	}

  async createComment(id: number, dto: request.CreateCommentDto): Promise<UserContactCommentEntity>{
		const body = Object.assign(dto, {contact_id: id});
    return {
      ...{
        id: (await this.repository_cc.insert(body)).raw?.insertId,
      },
      ...body,
    };
	}

  async updateComment(id: number, dto: request.CreateCommentDto): Promise<UserContactCommentEntity>{
		const body = Object.assign(dto, {id: id});
		return await this.repository_cc.save(body);
	}

  async deleteComment(id: number){
		if((await this.repository_cc.softDelete({id: id})).affected == 0){
      throw new NotFoundException();
    }
	}
}
