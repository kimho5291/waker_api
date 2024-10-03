import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
  @ApiProperty({ description: '문의사항 ID' })
  id: number;

  @ApiProperty({ description: '유저 ID' })
  user_id: number

  @ApiProperty({ description: '타이틀' })
  title: string;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiProperty({ description: '답글s', isArray: true, type: () => CommentDto })
  comments?: CommentDto[];

  @ApiProperty({ description: '생성일자' })
  created_at?: Date;

  @ApiProperty({ description: '수정일자' })
  updated_at?: Date;
}

export class CommentDto {
  @ApiProperty({ description: '문의사항 응답 ID' })
  id: number;

  @ApiProperty({ description: '답글' })
  comment: string;

  @ApiProperty({ description: '생성일자' })
  created_at?: Date;
}
