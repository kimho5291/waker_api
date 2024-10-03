import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { UserVoiceEntity } from 'src/voice/voice.entity';

@Entity({ name: 'alarm' })
export class AlarmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  voice_id: number;

  @Column()
  name: string;

  @Column()
  days: number;

  @Column()
  time: string;

  @Column()
  spacific_date?: string;

  @Column()
  is_active: Boolean;

  @Column()
  is_weekend: Boolean;

  @Column()
  volum: number;

  @Column()
  vibrate: Boolean;

  @Column()
  interest: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @OneToMany(() => AlarmVoiceEntity, o => o.alarm_id)
  alarm_voices?: AlarmVoiceEntity[]

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity

  @ManyToOne(() => UserVoiceEntity)
  @JoinColumn({ name: 'user_id' })
  voice?: UserVoiceEntity
}

@Entity({ name: 'alarm_voice' })
export class AlarmVoiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  alarm_id: number;

  @Column()
  alarm_path?: string;

  @CreateDateColumn()
  created_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => AlarmEntity)
  @JoinColumn({ name: 'alarm_id' })
  alarm?: AlarmEntity
}