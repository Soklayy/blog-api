import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { UserId } from 'src/common/decorators/user-id.dcorator';

@ApiTags('Blog comment')
@Controller('blog-comment')
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @ApiBearerAuth()
  @Post()
  create(
    @Body() createBlogCommentDto: CreateBlogCommentDto,
    @UserId() user: User,
  ) {
    createBlogCommentDto.user = user;
    return this.blogCommentService.create(createBlogCommentDto);
  }

  @Get()
  @Public()
  @ApiQuery({
    name: 'blog',
    description: "Blog's id",
    required: false,
  })
  findAll(@Query('blog') blogId: string) {
    return this.blogCommentService.findAll(blogId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.blogCommentService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogCommentDto: UpdateBlogCommentDto,
    @UserId() userId: string,
  ) {
    return this.blogCommentService.update(id, updateBlogCommentDto, userId);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.blogCommentService.remove(id, userId);
  }
}
