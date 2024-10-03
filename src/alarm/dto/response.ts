import { ApiProperty } from '@nestjs/swagger';

export class AlarmDto {
  @ApiProperty({ description: 'alarm ID' })
  id: number;

  @ApiProperty({ description: 'user ID' })
  user_id: number;

  @ApiProperty({ description: 'voice ID' })
  voice_id: number;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '요일(BIT MASK)' })
  days: number;

  @ApiProperty({ description: '알람 시간', example: "0718 => 7시 18분" })
  time: string;

  @ApiProperty({ description: '알람 특정 일자', example: "20240809" })
  specific_date?: string;

  @ApiProperty({ description: '알람 활성화 여부', example: "1 or 0 or true or false"})
  is_active: number;

  @ApiProperty({ description: '공휴일 활성화 여부', example: "1 or 0 or true or false"})
  is_weeked: number;

  @ApiProperty({ description: '볼륨 크기', example: "0 ~ 100"})
  volum: number;

  @ApiProperty({ description: '진동 여부', example: "1 or 0 or true or false"})
  vibrate: number;

  @ApiProperty({ description: '관심사 (BIT MASK)'})
  interest: number;

  @ApiProperty({ description: '알람 보이스s', isArray: true, type: () => AlarmVoiceDto})
  alarm_voices: AlarmVoiceDto[];

  @ApiProperty({ description: '생성일자' })
  created_at?: Date;

  @ApiProperty({ description: '수정일자' })
  updated_at?: Date;
}

export class AlarmVoiceDto{
  @ApiProperty({ description: 'alarmVoice ID' })
  id: number;

  @ApiProperty({ description: 'alarm ID' })
  alarm_id: number;

  @ApiProperty({ description: 'alarm wav file path' })
  alarm_path?: string;

  @ApiProperty({ description: '생성일자' })
  created_at?: Date;
}