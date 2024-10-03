import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Entity({ name: 'user_sso' })
export class UserSsoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  provider_type: number;

  @Column()
  provider_user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity
}