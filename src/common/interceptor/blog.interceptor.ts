import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, of } from 'rxjs';
import { DataSource } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Blog } from 'src/module/blog/entities/blog.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class BlogInterceptor implements NestInterceptor {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();

    if (req?.headers?.authorization) {
      try {
        const token = req.headers.authorization.split(' ');
        const user = this.jwt.verify(token[1], {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
        });
        if (user.role === Role.ADMIN) {
          if (req.params.id) {
            const blog = await this.dataSource
              .getRepository(Blog)
              .createQueryBuilder('blog')
              .where('blog.id = :id', { id: req.params.id })
              .leftJoin('blog.comment', 'comment')
              .leftJoin('blog.like', 'like')
              .leftJoin('blog.thumbnail', 'thumbnail')
              .leftJoin('comment.user', 'user')
              .leftJoin('user.profileImage', 'profileImage')
              .select([
                'blog',
                'thumbnail.url',
                'comment.comment',
                'comment.createdAt',
                'user.firstname',
                'user.lastname',
                'profileImage.url',
              ])
              .getOne();
            return of(blog);
          }
          const blog = await this.dataSource
            .getRepository(Blog)
            .createQueryBuilder('blog')
            .leftJoin('blog.comment', 'comment')
            .leftJoin('blog.like', 'like')
            .leftJoin('blog.thumbnail', 'thumbnail')
            .select(['blog', 'like', 'thumbnail.url', 'comment.id'])
            .groupBy('blog.id')
            .getMany();

          return of(blog);
        } else {
          const blog = await this.dataSource
            .getRepository(Blog)
            .createQueryBuilder('blog')
            .loadRelationCountAndMap('blog.like', 'blog.like', 'like')
            .leftJoin('blog.comment', 'comment')
            // .leftJoin('blog.like', 'like')
            // .leftJoin('blog.thumbnail', 'thumbnail')
            // .select(['blog', 'COUNT(like)', 'thumbnail.url', 'comment.id'])
            .select(['blog', 'thumbnail.url', 'comment.id'])
            .getMany();
          return of(blog);
        }
      } catch (error) {
        console.log(error);
      }
    }
    const blog = await this.dataSource
      .getRepository(Blog)
      .createQueryBuilder('blog')
      .loadRelationCountAndMap('blog.like', 'blog.like', 'like')
      .leftJoin('blog.comment', 'comment')
      .leftJoin('blog.thumbnail', 'thumbnail')
      .leftJoin('comment.user', 'user')
      .leftJoin('user.profileImage', 'profileImage')
      .addSelect([
        'thumbnail.url',
        'comment',
        'comment.comment',
        'comment.createdAt',
        'user.firstname',
        'user.lastname',
        'profileImage.url',
      ])
      .getMany();
    return of(blog);
    return next.handle();
  }
}
