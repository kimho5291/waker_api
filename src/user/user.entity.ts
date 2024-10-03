import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { UserSsoEntity } from 'src/auth/auth.entity';
import { AlarmEntity } from 'src/alarm/alarm.entity';
import { UserVoiceEntity, UserVoiceShareEntity } from 'src/voice/voice.entity';
import { UserContactEntity } from 'src/contact/contact.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  sex: boolean;

  @Column()
  birth: string;

  @Column()
  agreement: boolean;

  @CreateDateColumn()
  created_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @OneToMany(() => UserSsoEntity, o => o.user)
  ssos?: UserSsoEntity[]

  @OneToMany(() => AlarmEntity, o => o.user)
  alarms?: AlarmEntity[]

  @OneToMany(() => UserVoiceEntity, o => o.user)
  voices?: UserVoiceEntity[]
  
  @OneToMany(() => UserVoiceShareEntity, o => o.user)
  shares?: UserVoiceShareEntity[]

  @OneToMany(() => UserContactEntity, o => o.user)
  contants?: UserContactEntity[]
}