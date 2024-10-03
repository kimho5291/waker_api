import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Unique } from 'typeorm';


export class DecimalColumnTransformer {
  to(data: number): number {
      return data;
  }
  from(data: string): number {
      return parseFloat(data);
  }
}

@Entity({ name: 'regions' })
export class RegionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column('decimal', {precision: 10, scale: 7, transformer: new DecimalColumnTransformer(),})
  latitude: number;

  @Column('decimal', {precision: 10, scale: 7, transformer: new DecimalColumnTransformer(),})
  longitude: number;

  @Column()
  nx: number;

  @Column()
  ny: number;

  @OneToMany(() => ForecastEntity, (e) => e.region)
  forecasts: ForecastEntity[];

  @OneToMany(() => DailyForecastEntity, (e) => e.region)
  dailyForecasts: DailyForecastEntity[];
}

@Entity('forecast')
@Unique(['datetime', 'region']) // datetime과 region의 조합으로 고유한 예보 데이터를 보장
export class ForecastEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unsigned: true })
  region_id: number;  // region_id 컬럼을 명시적으로 추가

  @ManyToOne(() => RegionEntity, (e) => e.forecasts)
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;

  @Column({ type: 'datetime' })
  datetime: Date;  // 예보 시간 (DATETIME 형식)

  @Column({ type: 'float', nullable: true })
  TMP: number; // 1시간 기온 (℃)

  @Column({ type: 'float', nullable: true })
  UUU: number; // 동서바람성분 (m/s)

  @Column({ type: 'float', nullable: true })
  VVV: number; // 남북바람성분 (m/s)

  @Column({ type: 'float', nullable: true })
  VEC: number; // 풍향 (deg)

  @Column({ type: 'float', nullable: true })
  WSD: number; // 풍속 (m/s)

  @Column({ type: 'int', nullable: true })
  SKY: number; // 하늘상태 (코드값)

  @Column({ type: 'int', nullable: true })
  PTY: number; // 강수형태 (코드값)

  @Column({ type: 'int', nullable: true })
  POP: number; // 강수확률 (%)

  @Column({ type: 'float', nullable: true })
  WAV: number; // 파고 (M)

  @Column({ type: 'float', nullable: true })
  PCP: number; // 1시간 강수량 (범주)

  @Column({ type: 'int', nullable: true })
  REH: number; // 습도 (%)

  @Column({ type: 'float', nullable: true })
  SNO: number; // 1시간 신적설 (범주)
}


@Entity('daily_forecast')
@Unique(['datetime', 'region_id']) // 특정 날짜와 지역의 조합이 고유하도록 설정
export class DailyForecastEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unsigned: true })
  region_id: number;  // region_id 컬럼을 명시적으로 추가

  @ManyToOne(() => RegionEntity, (region) => region.dailyForecasts)
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;

  @Column({ type: 'date' })
  datetime: Date;  // The date for this forecast summary

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true, transformer: new DecimalColumnTransformer() })
  TMN: number; // Minimum temperature

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true, transformer: new DecimalColumnTransformer() })
  TMX: number; // Maximum temperature

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true, transformer: new DecimalColumnTransformer() })
  SKY: number; // Average sky condition

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true, transformer: new DecimalColumnTransformer() })
  POP: number; // Probability of precipitation

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true, transformer: new DecimalColumnTransformer()})
  PCP: number; // Total precipitation

  @Column({ type: 'int', nullable: true })
  PTY: number; // 강수 형태 (코드값)

  @Column({ type: 'varchar', length: 50, nullable: true })
  WSM: string; // Weather summary
}