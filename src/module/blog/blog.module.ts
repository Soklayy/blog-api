import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { FileModule } from '../file/file.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    UserModule,
    FileModule,
    JwtModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
