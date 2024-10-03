import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "src/config/config.service";
import { DailyForecastEntity, ForecastEntity, RegionEntity } from "./weather.entity";
import { Repository } from "typeorm";
import { catchError, lastValueFrom, map } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Cron } from "@nestjs/schedule";

interface WeatherRes {
  header: {resultCode: string, resultMsg: string};
  body: {dataType: string, items: {item: Array<WeatherDetail>}, pageNo: number, numOfRows: number, totalCount: number};
}

interface WeatherDetail {
  baseDate: string;
  baseTime: string;
  fcstDate: string;
  fcstTime: string;
  category: string; // TMP, UUU, VVV, VEC, WSD, SKY, PTY, POP, WAV, PCP, REH, SNO
  fcstValue: any;
  nx: number;
  ny: number;
}

@Injectable()
export class WeatherService{
  constructor(
    @InjectRepository(RegionEntity) private repository_r: Repository<RegionEntity>,
    @InjectRepository(ForecastEntity) private repository_f: Repository<ForecastEntity>,
    @InjectRepository(DailyForecastEntity) private repository_df: Repository<DailyForecastEntity>,
    private configService: ConfigService,
    private httpService: HttpService
  ){
    //this.updateWeatherForecast();
  }

  // 매일 2:10, 5:10, 8:10, 11:10, 14:10, 17:10, 20:10, 23:10에 실행
  //@Cron('10 2,5,8,11,14,17,20,23 * * *')  
  async updateWeatherForecast() {
    console.log('Fetching updated weather forecast...');

    try {
      const regions = await this.repository_r.find();

      // 예보 데이터를 조회하고 업데이트하는 로직
      const newForecast = await this.sendWeatherApi(regions[0])

      // 데이터베이스에 저장하거나 필요한 처리를 수행
      await this.upsertForcasts(newForecast);

      // forecast 전체 조회
      const foreacast = await this.repository_f.find();

      // 날짜별로 그룹화
      const groupedData = this.groupByDateAndRegion(foreacast);

      // 그룹화된 데이터 전처리
      const dailyForecast = this.processDailyForecast(groupedData);

      // daily_forecast upsert
      await this.upsertDaliyForcasts(dailyForecast);

      console.log('Weather forecast updated successfully');
    } catch (error) {
      console.error('Error updating weather forecast:', error);
    }
  }

  async sendWeatherApi(region: RegionEntity): Promise<ForecastEntity[]>{
    const config = await this.configService.getApiConfig();
    //const date = "20240828T1700".split("T");
    const date = new Date().getDateFormatYYMMDDTHHMMSS().split("T");
    const params = {
      ServiceKey: config.weather,
      pageNo: 1,
      numOfRows: 350,
      dataType: "JSON",
      base_date: date[0],
      base_time: date[1],
      nx: region.nx,
      ny: region.ny
    }

    const weather: WeatherRes = await lastValueFrom(
      this.httpService.get(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`, {
        params: params
      }).pipe(
        map(response => response?.data.response),
        catchError(error => { throw new Error(`weather api fail : ${error}`) })
      )
    )

    // console.log(params);
    // console.log(weather.body.items.item);

    const processedData = {};

    weather.body.items.item.forEach(item => {
      const key = `${item.fcstDate}_${item.fcstTime}`;
        if (!processedData[key]) {
            processedData[key] = {
              region_id: region.id,
              datetime: this.convertToDatetime(`${item.fcstDate}${item.fcstTime}`),
            };
        }

        // 예외 처리: 숫자로 변환할 수 없는 값을 0으로 처리
        let value = item.fcstValue;
        if (isNaN(value)) {
            value = 0;
        } else {
            // 정수형 컬럼과 실수형 컬럼에 따라 변환 방식 결정
            if (["TMP", "UUU", "VVV", "VEC", "WSD", "WAV", "PCP", "SNO"].includes(item.category)) {
                value = parseFloat(value);  // 실수형 데이터
            } else {
                value = parseInt(value, 10);  // 정수형 데이터
            }
        }
        processedData[key][item.category] = value;
    })

    return Object.values(processedData);
  }

  convertToDatetime(str: string): string {
    const year = str.substring(0, 4);
    const month = str.substring(4, 6);
    const day = str.substring(6, 8);
    const hour = str.substring(8, 10);
    const minute = str.substring(10, 12);
    return `${year}-${month}-${day} ${hour}:${minute}:00`;
  }

  async upsertForcasts(forcasts: ForecastEntity[]){
    await this.repository_f.upsert(forcasts, ['datetime', 'region_id']);
  }

  groupByDateAndRegion(forecasts: ForecastEntity[]): Record<string, ForecastEntity[]> {
    return forecasts.reduce((acc, forecast) => {
      const dateOnly = forecast.datetime.toISOString().slice(0, 10);;
      const key = `${dateOnly}_${forecast.region_id}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(forecast);
      return acc;
    }, {});
  }

  processDailyForecast(groupedData: Record<string, ForecastEntity[]>): DailyForecastEntity[] {
    return Object.entries(groupedData).map(([key, forecasts]) => {
      const [date, regionId] = key.split('_');

      const dailyForecast = new DailyForecastEntity();
      dailyForecast.datetime = new Date(date);
      dailyForecast.region_id = Number(regionId);
      dailyForecast.TMN = Math.min(...forecasts.map(f => f.TMP));
      dailyForecast.TMX = Math.max(...forecasts.map(f => f.TMP));
      dailyForecast.SKY = this.calculateAverage(forecasts.map(f => f.SKY));
      dailyForecast.POP = this.calculateAverage(forecasts.map(f => f.POP));
      dailyForecast.PCP = forecasts.reduce((sum, f) => sum + (f.PCP || 0), 0);
      dailyForecast.PTY = forecasts.find(f => f.PTY !== undefined)?.PTY || 0;
      dailyForecast.WSM = this.summarizeWeather(dailyForecast.SKY, dailyForecast.POP, dailyForecast.PTY, dailyForecast.PCP);

      return dailyForecast;
    });
  }

  calculateAverage(values: number[]): number {
    const validValues = values.filter(v => v !== null && v !== undefined);
    return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
  }

  summarizeWeather(sky: number, pop: number, pty: number, pcp: number): string {
    if (pty === 3 || pcp > 0) return 'Snowy';  // 눈이 올 때
    if (pty === 1 || pcp > 0) return 'Rainy';  // 비가 올 때
    if (pty === 2) return 'Rain/Snow';  // 비와 눈이 섞일 때
    if (pty === 4) return 'Shower';  // 소나기
    if (sky === 1) return 'Clear';  // 맑음
    if (sky === 3) return 'Partly Cloudy';  // 구름 많음
    if (sky === 4) return 'Cloudy';  // 흐림
    if (pop > 50 && pty === 0) return 'Cloudy with Chance of Rain';  // 흐리고 비 올 가능성
    if (pop > 50 && sky === 1) return 'Partly Cloudy with Chance of Rain';  // 맑고 비 올 가능성

    return 'Clear';  // 기본값은 맑음
  }

  async upsertDaliyForcasts(dailyForecasts: DailyForecastEntity[]){
    await this.repository_df.upsert(dailyForecasts, ['datetime', 'region_id']);
  }

  /**
   * 위치, 하늘 상태(맑음, 구름 많음, 흐림), 예측 일자, 최대 기온, 최소 기온, 강수확률, 강수량
   * 오늘 서울의 날씨 흐는 30~25도 사이입니다. 강수확률은 45%로 비가올 수 있으니 우산을 챙기는걸 추천합니다.
   * 
   * 오늘 서울의 날씨는 25~30도 사이입니다. 강수확률은 100%로 우산을 무조건 챙기시길 바랍니다.
   * 
   * 오늘 서울의 날씨는 16~25도 사이입니다. 일교차가 큰편이니 얇은 겉옷을 챙기시길 추천합니다. 또한, 강수확률은 10%로 우산은 챙기지 않아도 될 것 같습니다.
   */

}