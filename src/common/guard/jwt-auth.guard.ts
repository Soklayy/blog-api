import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      const req = context.switchToHttp().getRequest();
      if (req?.headers?.authorization) {
        try {
          const token = req.headers.authorization.split(' ');
          const user = this.jwt.verify(token[1], {
            secret: this.configService.get<string>('JWT_SECRET_KEY'),
          });
          return (super.getRequest(context).user = user);
        } catch (error) {}
      }

      return true;
    }

    return super.canActivate(context);
  }
}
