import { Module } from '@nestjs/common';
import { BlogLikeService } from './blog-like.service';
import { BlogLikeController } from './blog-like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogLike } from './entities/blog-like.entity';
import { Blog } from '../blog/entities/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogLike, Blog])],
  controllers: [BlogLikeController],
  providers: [BlogLikeService],
})
export class BlogLikeModule {}
