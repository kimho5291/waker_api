import { ApiProperty } from '@nestjs/swagger';

export class NoticeDto {
  @ApiProperty({ description: '공지사항 ID' })
  id: number;

  @ApiProperty({ description: '타이틀' })
  title: string;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiProperty({ description: '생성일자' })
  created_at?: Date;
}
