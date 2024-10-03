
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';


@Entity({ name: 'faq' })
export class FaqEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  answer: string;

  @CreateDateColumn()
  created_at?: Date;
}