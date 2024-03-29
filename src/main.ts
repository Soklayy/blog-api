import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from './config/swagger.config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors({
    origin: [
      configService.get<string>('PRONTEND_URL'),
      configService.get<string>('ADMIN_URL'),
    ]
  });

  app.use(helmet());

  //swagger
  swaggerConfig(app);

  const port = process.env.PORT || 3000;
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(port).then(() => console.log(`app run on port ${port}`));
}
bootstrap();
