import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiConflictResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service'
import * as request from './dto/request';
import * as response from './dto/response';
import { Response, Request } from 'express';
import { KakaoFactory } from './oauth/kakao.factory';
import { BaseFactory, OauthType } from './oauth/oauth.factory';
import { RefreshGuard } from './jwt.strategy';
import { User } from 'src/user/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { NaverFactory } from './oauth/naver.factory';
import { GoogleFactory } from './oauth/google.factory';



@Controller('')
@ApiTags('auth')
export class AuthController {

	constructor(
		private service: AuthService,
		private kakaoFactory: KakaoFactory,
		private NaverFactory: NaverFactory,
		private GoogleFacoty: GoogleFactory,
	) {}

	private getOauthFactory(type: number): BaseFactory {
    switch (type as OauthType) {
      case OauthType.KAKAO:
        return this.kakaoFactory;
			case OauthType.NAVER:
				return this.NaverFactory;
      case OauthType.GOOGLE:
        return this.GoogleFacoty;
      // case OauthType.APPLE:
      //   return this.kakaoFactory;
      default:
        throw new BadRequestException('unsupport provider_type');
    }
  }

	@Get('test/testlogin')
	@ApiOperation({ summary: '테스트 유저 로그인 1번 유저 고정' })
  @ApiOkResponse({type: response.Token })
  async testLogin(
		@Res({ passthrough: true })res: Response
	){
		return await this.service.testLogin(res);
	}

	@Get('auth/:provider_type/redirect')
	@ApiOperation({
    summary: '로그인',
    description: '0: KAKAO, 1: GOOGLE, 2: NAVER, 3: APPLE<br>400 에러는 회원가입 시 필요한 access code 반환<br>409 에러는 해당 email로 provider_code에 맞는 sso 가입이력이 있다고 알려준다.',
  })
	@ApiOkResponse({ type: response.Token })
	@ApiBadRequestResponse({ type: response.RequiredSignup })
	@ApiConflictResponse({type: response.SsoExisted})
	async signinByOauthCode(
    @Param('provider_type') type: number,
    @Query('code') code: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<response.Token> {
    return this.service.signinByAuthCode(
      this.getOauthFactory(type),
      code,
      req,
      res
    );
  }

	// @Post('auth/:provider_type')
  // @ApiOperation({summary: '로그인',description: '0: KAKAO, 1: GOOGLE, 2: NAVER, 3: APPLE<br>로그인 시 Authorization(Access)과 Cookie(Refresh)를 포함해서 응답한다.<br>400 에러는 회원가입 시 필요한 access code 반환<br>409 에러는 해당 email로 provider_code에 맞는 sso 가입이력이 있다고 알려준다.',
  // })
  // @ApiOkResponse({ type: response.Token })
  // @ApiBadRequestResponse({ type: response.RequiredSignup })
  // @ApiConflictResponse({type: response.SsoExisted})
  // async signinByAccessToken(
  //   @Res({ passthrough: true }) res: Response,
  //   @Param('provider_type') type: number,
  //   @Body() token: request.Token,
  // ): Promise<response.Token> {
  //   return this.service.signinByAccessToken(
  //     this.getOauthFactory(type),
  //     token.access_token,
  //     res
  //   );
  // }

	@Post('auth/:provider_type/signup')
  @ApiOperation({
    summary: '회원가입',
    description: '0: KAKAO, 1: GOOGLE, 2: NAVER, 3: APPLE<br>회원가입 성공 시 Authorization(Access)과 Cookie(Refresh)를 포함해서 응답한다.',
  })
  @ApiOkResponse({ type: response.Token })
  @ApiBadRequestResponse({ type: response.RequiredSignup })
  async signupByAccessToken(
    @Res({ passthrough: true }) res: Response,
    @Param('provider_type') type: number,
    @Body() dto: request.CreateUserDto,
  ): Promise<response.Token> {
    return this.service.signupByAccessToken(
      this.getOauthFactory(type),
      dto.access_token,
      dto,
      res
    );
  }

	@Get('token/refresh')
  @UseGuards(RefreshGuard)
  @ApiOperation({
    summary: 'access 토큰 재발행',
    description: '수신 받은 refresh를 포함한 요청을 보내면 처리됨<br>access 재발행 때 refresh도 재발행해줌<br>401로 응답가면 다시 로그인 해야함',
  })
  @ApiOkResponse({ type: response.Token })
  refresh(
    @User() user: UserEntity,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<response.Token> {
    return this.service.tokenRefresh(user, req.cookies.refresh, res);
  }

}
