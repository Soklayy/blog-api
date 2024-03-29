import { Injectable } from '@nestjs/common';
import { BlogLikeDto } from './dto/create-blog-like.dto';
import { Repository } from 'typeorm';
import { BlogLike } from './entities/blog-like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Blog } from '../blog/entities/blog.entity';

@Injectable()
export class BlogLikeService {
  constructor(
    @InjectRepository(BlogLike)
    private readonly likeRepo: Repository<BlogLike>,
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
  ) {}

  async like(blogLikeDto: BlogLikeDto) {
    const like = await this.likeRepo.findOne({
      where: {
        user: {
          id: blogLikeDto.user,
        },
        blog: {
          id: blogLikeDto.blog,
        },
      },
    });

    if (like) {
      await this.likeRepo.remove(like);
      return {
        message: 'Unliked',
      };
    }

    const user = new User();
    user.id = blogLikeDto.user;
    const blog = new Blog();
    blog.id = blogLikeDto.blog;

    await this.likeRepo.save(
      this.likeRepo.create({
        blog: blog,
        user: user,
      }),
    );

    return {
      message: 'Liked',
    };
  }

  find(userId: string) {
    // return this.likeRepo.createQueryBuilder('like')
    //   .leftJoin("like.user", "user")
    //   .where("user.id = :id", { id: userId })
    //   .leftJoin("like.blog", "blog")
    //   .select(['like', 'blog.id'])
    //   .getMany()

    return this.blogRepo.find({
      where: {
        like: {
          user: {
            id: userId,
          },
        },
        isPublic: true,
      },
    });
  }

  findByBlog(blogId: string) {
    return this.likeRepo
      .createQueryBuilder('like')
      .leftJoin('like.user', 'user')
      .leftJoin('user.profileImage', 'image')
      .where('like.blog.id = :blogid', { blogid: blogId })
      .addSelect(['user.firstname', 'user.lastname', 'image.url'])
      .getMany();
  }
}
