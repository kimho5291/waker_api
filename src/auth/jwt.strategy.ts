import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Request } from 'express';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private configService: ConfigService
  ) {}
   
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token) throw new UnauthorizedException();

    try{
      const payload = verify(
        token,
        (await this.configService.getJwtConfig()).access_secret,
        {
          ignoreExpiration: false
        }
      )
      request['user'] = payload;
    }
    catch{
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private configService: ConfigService
  ) {}
   
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if(!token) throw new UnauthorizedException();

    try{
      const payload = verify(
        token,
        (await this.configService.getJwtConfig()).refresh_secret,
        {
          ignoreExpiration: false
        }
      )
      request['user'] = payload;
    }
    catch{
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const token = request.cookies['refresh'];
    return token ? token : undefined;
  }
}