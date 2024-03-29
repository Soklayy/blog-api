import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { FileService } from '../file/file.service';
import { UserService } from '../user/user.service';
import { Role } from 'src/common/enums/role.enum';
import { User } from '../user/entities/user.entity';
import { File } from '../file/entities/file.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) { }

  async create(createBlogDto: CreateBlogDto, file: Express.Multer.File) {
    if (file) {
      return await this.blogRepo.save(
        this.blogRepo.create({
          ...createBlogDto,
          thumbnail: await this.fileService.create(file),
        }),
      );
    }
    return this.blogRepo.save(this.blogRepo.create(createBlogDto));
  }

  async findAll(userId: string) {
    const query = this.blogRepo
      .createQueryBuilder('blog')
      .loadRelationCountAndMap('blog.like', 'blog.like', 'like')
      .leftJoin('blog.comment', 'comment')
      .leftJoin('blog.thumbnail', 'thumbnail')
      .leftJoin('comment.user', 'user')
      .leftJoin('user.profileImage', 'profileImage')
      .orderBy('blog.createdAt', 'DESC')
      .addSelect([
        'thumbnail.url',
        'comment',
        'comment.comment',
        'comment.createdAt',
        'user.firstname',
        'user.lastname',
        'profileImage.url',
      ]);

    if (userId) {
      const user = (await this.userService
        .findOneById(userId)
        .catch((error) => { })) as User;

      //ADMIN mangement
      if (user?.role === Role.ADMIN) {
        return await query.getMany();
      }

      // for user that loged in
      else if (user?.role === Role.USER) {
        return await query
          .where('blog.isPublic = :isPublic', { isPublic: true })
          .leftJoinAndMapOne(
            'blog.isLike',
            'blog.like',
            'likes',
            'likes.user.id = :id',
            {
              id: user.id,
            },
          )
          .getMany();
      }
    }

    //for user that unauthenticated
    return await query
      .where('blog.isPublic = :isPublic', { isPublic: true })
      .getMany();
  }

  async findOne(id: string, userId: string) {
    let blog: Blog | null = null;
    const query = this.blogRepo
      .createQueryBuilder('blog')
      .leftJoin('blog.comment', 'comment')
      .leftJoin('blog.thumbnail', 'thumbnail')
      .leftJoin('comment.user', 'user')
      .leftJoin('user.profileImage', 'profileImage')
      .loadRelationCountAndMap('blog.like', 'blog.like', 'like')
      .leftJoinAndMapOne(
        'blog.isLike',
        'blog.like',
        'likes',
        'likes.user.id = :id',
        {
          id: userId,
        },
      )
      .addSelect([
        'thumbnail.url',
        'comment',
        'comment.comment',
        'comment.createdAt',
        'user.firstname',
        'user.id',
        'user.lastname',
        'profileImage.url',
      ])
      .where('blog.id = :blogid', { blogid: id });

    if (userId) {
      const user = (await this.userService
        .findOneById(userId)
        .catch((error) => { })) as User;

      //ADMIN mangement
      if (user?.role === Role.ADMIN) {
        blog = await query.getOne();
      }

      // for user that loged in
      else if (user?.role === Role.USER) {
        blog = await query
          .andWhere('blog.isPublic = :isPublic', { isPublic: true })
          .getOne();
      }
    } else {
      //for user that unauthenticated
      blog = await query
        .andWhere('blog.isPublic = :isPublic', { isPublic: true })
        .getOne();
    }

    if (!blog) throw new NotFoundException('Blog not found!');

    return blog;
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    file?: Express.Multer.File,
  ) {
    const blog = await this.blogRepo.findOneBy({ id });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    let thumbnail: File | null = null
    try {
      Object.assign(blog, updateBlogDto)

      if (file) {
        if (blog.thumbnail) {
          await this.fileService.update(blog.thumbnail.id, file);
        } else {
          blog.thumbnail = thumbnail = await this.fileService.create(file);
        }
      }

      return await this.blogRepo.save(blog);
    } catch (error) {
      if (error.code == 'ER_DATA_TOO_LONG') {
        throw new BadRequestException(
          'Data too long for "title" or "description"',
        );
      }

      if (thumbnail) {
        await this.fileService.delete(thumbnail.id)
      }
      
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    const blog = await this.blogRepo.findOneBy({ id });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await this.blogRepo.delete(id);
    if (blog.thumbnail) {
      await this.fileService.delete(blog.thumbnail.id);
    }

    return {
      message: `Succes to removes a blog with id ${blog.id}`,
    };
  }

  async latest() {
    return this.blogRepo
      .createQueryBuilder('blog')
      .loadRelationCountAndMap('blog.like', 'blog.like', 'like')
      .leftJoin('blog.comment', 'comment')
      .leftJoin('blog.thumbnail', 'thumbnail')
      .leftJoin('comment.user', 'user')
      .leftJoin('user.profileImage', 'profileImage')
      .orderBy('blog.createdAt', 'DESC')
      .where('blog.isPublic = :isPublic', { isPublic: true })
      .addSelect([
        'thumbnail.url',
        'comment',
        'comment.comment',
        'comment.createdAt',
        'user.firstname',
        'user.lastname',
        'profileImage.url',
      ])
      .getOne();
  }
}
