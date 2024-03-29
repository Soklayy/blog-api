import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogComment } from './entities/blog-comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogComment)
    private readonly blogCommentRepo: Repository<BlogComment>,
  ) {}

  create(createBlogCommentDto: CreateBlogCommentDto) {
    return this.blogCommentRepo.save(
      this.blogCommentRepo.create(createBlogCommentDto),
    );
  }

  findAll(blogid: string) {
    if (blogid) {
      return this.blogCommentRepo
        .createQueryBuilder('comment')
        .leftJoin('comment.user', 'user')
        .leftJoin('user.profileImage', 'profileImage')
        .where('comment.blog.id = :id', { id: blogid })
        .orderBy('comment.createdAt', 'DESC')
        .select([
          'comment',
          'user.firstname',
          'user.lastname',
          'profileImage.url',
        ])
        .getMany();
    }
    return this.blogCommentRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .leftJoin('user.profileImage', 'profileImage')
      .leftJoin('comment.blog', 'blog')
      .leftJoin('blog.thumbnail', 'thumbnail')
      .orderBy('comment.createdAt', 'DESC')
      .select([
        'comment',
        'user.firstname',
        'user.lastname',
        'profileImage.url',
        'blog.id',
        'blog.title',
        'thumbnail.url',
      ])
      .getMany();
  }

  async findOne(id: string) {
    const blog = await this.blogCommentRepo
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id: id })
      .leftJoin('comment.user', 'user')
      .leftJoin('user.profileImage', 'profileImage')
      .leftJoin('comment.blog', 'blog')
      .leftJoin('blog.thumbnail', 'thumbnail')
      .select([
        'comment',
        'user.firstname',
        'user.lastname',
        'profileImage.url',
        'blog.id',
        'thumbnail.url',
      ])
      .getOne();

    if (!blog) throw new NotFoundException('Comment not found!');

    return blog;
  }

  async update(
    id: string,
    updateBlogCommentDto: UpdateBlogCommentDto,
    userId?: string,
  ) {
    const comment = await this.blogCommentRepo.findOne({
      where: {
        id: id,
        user: {
          id: userId,
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found!');
    }

    comment.comment = updateBlogCommentDto.comment;

    const newComment = await this.blogCommentRepo.save(comment);
    delete newComment.user;

    return newComment;
  }

  async remove(id: string, userId: string) {
    const comment = await this.blogCommentRepo.findOne({
      where: {
        id: id,
        user: {
          id: userId,
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found!');
    }

    await this.blogCommentRepo.delete(id);

    return {
      message: `The comment '${comment?.id}' has deleted`,
    };
  }
}
