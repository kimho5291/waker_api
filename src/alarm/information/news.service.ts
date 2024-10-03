import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NewsEntity } from "./news.entity";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { Cron } from "@nestjs/schedule";
import { ConfigService } from "src/config/config.service";
import { catchError, lastValueFrom, map } from "rxjs";

export interface NewsRes{
  detail: {message: string, code: string, ok: string},
  total_items: number,
  total_pages: number,
  page: number,
  page_size: number,
  data: NewsData[]
} 

interface NewsData {
  id: string,
  sections: string[],
  title: string,
  publisher: string,
  author: string,
  summary: string,
  image_url: string,
  content_url: string,
}

@Injectable()
export class NewsService{
  constructor(
    @InjectRepository(NewsEntity) private repository: Repository<NewsEntity>,
    private httpService: HttpService,
    private configService: ConfigService
  ){
    //this.fetchNews();
  }

  //@Cron('0 9 * * *') // 매일 오전 9시에 실행
  async fetchNews(){
    console.log('Fetching news at 9:00 AM...');

    // 뉴스 데이터를 가져오는 로직을 여기에 작성합니다.
    // 예: HTTP 요청을 통해 외부 API에서 뉴스 데이터를 가져오고, 데이터베이스에 저장
    try {
      // 예시: API 호출하여 뉴스 데이터 가져오기
      // const newsData = await this.httpService.get('https://newsapi.org/v2/top-headlines', {
      //   params: { country: 'kr', apiKey: 'YOUR_API_KEY' },
      // }).toPromise();

      //const Section = ['politics', 'economy', 'society', 'culture', 'world', 'tech', 'entertainment', 'opinion'];

      const Section = ['tech'];

      Section.forEach(async e => {
        const newsRes = await this.sendNewsAPI(e);
        const NewsEntities = this.processNewsData(newsRes);
        await this.upsertNewsData(NewsEntities);
      });


      // // 가져온 데이터를 데이터베이스에 저장
      // await this.newsRepository.save(newsData);

      console.log('News fetched and saved successfully.');
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }

  async sendNewsAPI(section: string): Promise<NewsRes>{
    const config = await this.configService.getApiConfig();
    const date = new Date().getDateFormatYY_MM_DD();
    const params = {
      api_key: config.news,
      date_from: date,
      date_to: date,
    }
    const url = `https://api-v2.deepsearch.com/v1/articles/${section}`

    // console.log(params);
    // console.log(url);
    
    return await lastValueFrom(
      this.httpService.get(url, {
        params: params
      }).pipe(
        map(response => response?.data),
        catchError(error => { throw new Error(`news api fail : ${error}`) })
      )
    )
  }

  processNewsData(newsRes: NewsRes): NewsEntity[]{
    return newsRes.data.map(item => {
      const newsEntity = new NewsEntity();
      newsEntity.news_id = item.id;
      newsEntity.section = item.sections.length > 0 ? item.sections[0] : 'Unknown';
      newsEntity.title = item.title;
      newsEntity.publisher = item.publisher;
      newsEntity.author = item.author || 'Unknown';
      newsEntity.summary = item.summary;
      newsEntity.content_url = item.content_url;
      return newsEntity;
    })
  }

  async upsertNewsData(newsEntities: NewsEntity[]){
    return await this.repository.upsert(newsEntities, ['news_id'])
  }

}