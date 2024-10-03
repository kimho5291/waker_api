import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from 'src/config/config.service';
import { AppInfo } from 'src/config/dto/config';

@Controller('')
@ApiTags('etc')
export class EtcController {
  constructor(private config: ConfigService){}

  @Get('etc/info')
	@ApiOperation({ summary: 'APP 정보 가져오기' })
  @ApiOkResponse({type: AppInfo })
  async testLogin(): Promise<AppInfo>{
		return await this.config.getAppInfo();
	}

  @Get('hello')
  @ApiOperation({ summary: 'Stress Test' })
  stressTest(){
		return "Hello, World!!";
	}
  
}
