import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Unique } from 'typeorm';


@Entity({ name: 'news' })
export class NewsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  news_id: string;

  @Column()
  section: string;

  @Column()
  title: string

  @Column()
  publisher: string;

  @Column()
  author: string;

  @Column()
  summary: string;

  @Column()
  content_url: string;

  @CreateDateColumn()
  created_at: Date

}