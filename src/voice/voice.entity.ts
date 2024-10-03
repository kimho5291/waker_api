import { AlarmEntity } from 'src/alarm/alarm.entity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

// 명언, 일상, 스포츠, 과학, 상식퀴즈, 문학, IT, 취미/자기개발, 역사, 음식
// enum의 숫자는 bitmask를 하기위해서 2의 제곱수를 뜻한다.
export enum Interest{
  LITERATURE = 0,
  DAYILROUTINE,
  SPORTS,
  SCIENCE,
  COMMENTSENSE,
  IT,
  SELFDEVELOPMENT,
  HISTRORY,
  FOOD,
}


@Entity({ name: 'user_voice' })
export class UserVoiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  voice_code: string;

  @Column()
  name: string;

  @Column()
  origin_path: string;

  @Column()
  header_path?: string;

  @Column()
  intro_path?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity

  @OneToMany(() => UserVoiceShareEntity, o => o.voice)
  shares?: UserVoiceShareEntity[]

  @OneToMany(() => AlarmEntity, o => o.voice)
  alarms?: AlarmEntity[]
}

@Entity({ name: 'user_voice_share' })
export class UserVoiceShareEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  voice_id: number;

  @Column()
  user_id: number;

  @Column()
  intro_path?: string;

  @CreateDateColumn()
  created_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity

  @ManyToOne(() => UserVoiceEntity)
  @JoinColumn({ name: 'voice_id' })
  voice?: UserVoiceEntity
}

@Entity({ name: 'basic_alarm_voice' })
export class BasicAlarmVoiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: number;

  @Column()
  path: string;

  @CreateDateColumn()
  created_at?: Date;
}