import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'user_contact' })
export class UserContactEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({name: 'user_id'})
  user?: UserEntity

  @OneToOne(() => UserContactCommentEntity, o => o.contact)
  comment?: UserContactEntity
}

@Entity({ name: 'user_contact_comment' })
export class UserContactCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contact_id: number;

  @Column()
  comment: string;

  @CreateDateColumn()
  created_at?: Date;

  @OneToOne(() => UserContactEntity)
  @JoinColumn({name : 'contact_id'})
  contact?: UserContactEntity
}