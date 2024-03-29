import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guard/roles.guard';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UniqueValidator } from './common/validations/is-unigue.validation';
import { FirebaseModule } from './module/firebase/firebase.module';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';
import { BlogModule } from './module/blog/blog.module';
import { MulterModule } from '@nestjs/platform-express';
import { FileModule } from './module/file/file.module';
import { BlogCommentModule } from './module/blog-comment/blog-comment.module';
import { ExistValidator } from './common/validations/is-exists.validattion';
import { BlogLikeModule } from './module/blog-like/blog-like.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    UserModule,
    AuthModule,
    FirebaseModule,
    BlogModule,
    MulterModule,
    FileModule,
    BlogCommentModule,
    BlogLikeModule,
  ],
  providers: [
    UniqueValidator,
    ExistValidator,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
