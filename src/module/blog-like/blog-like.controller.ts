import { Controller, Post, Body, Req, Get, Param } from '@nestjs/common';
import { BlogLikeService } from './blog-like.service';
import { BlogLikeDto } from './dto/create-blog-like.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { UserId } from 'src/common/decorators/user-id.dcorator';

@ApiTags('Blog like')
@Controller('blog-like')
export class BlogLikeController {
  constructor(private readonly blogLikeService: BlogLikeService) { }

  @ApiBearerAuth()
  @Post()
  async like(@Body() blogLikeDto: BlogLikeDto, @UserId() id: string) {
    blogLikeDto.user = id
    return await this.blogLikeService.like(blogLikeDto);
  }

  @ApiBearerAuth()
  @Get()
  find(@Req() req: any) {
    return this.blogLikeService.find(req?.user?.id as string);
  }

  @Get(':blogid')
  @Public()
  findByBlog(@Param('blogid') blogId: string) {
    return this.blogLikeService.findByBlog(blogId);
  }
}
