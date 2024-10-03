import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import * as request from './dto/request';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private repository: Repository<UserEntity>
  ){}

  async get(user: UserEntity): Promise<UserEntity>{
    return await this.repository.findOne({where: {id: user.id}});
  }

  async update(user: UserEntity, dto: request.UpdateDto): Promise<UserEntity>{
    const updatedUser = Object.assign(dto, {id: user.id});
    return await this.repository.save(updatedUser as UserEntity);
  }

  async delete(user: UserEntity){
    if((await this.repository.softDelete({id: user.id})).affected == 0){
      throw new NotFoundException();
    }
  }


}
