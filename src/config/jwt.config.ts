import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export async function JwtConfig(config: ConfigService) {
  return {
    secret: config.get<string>('JWT_SECRET_KEY'),
    signOptions: {
      expiresIn: Number(config.get('JWT_TOKEN_EXPIRATION')),
    },
  } as JwtModuleOptions;
}
