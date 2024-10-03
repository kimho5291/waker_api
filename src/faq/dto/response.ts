import { ApiProperty } from '@nestjs/swagger';

export class FaqDto {
  @ApiProperty({ description: 'faq ID' })
  id: number;

  @ApiProperty({ description: '질문' })
  question: string;

  @ApiProperty({ description: '답변' })
  answer: string;

  @ApiProperty({ description: '생성일자' })
  created_at?: Date;
}
