import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UserId } from 'src/common/decorators/user-id.dcorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogService.create(createBlogDto, file);
  }

  @Get()
  @Public()
  @ApiBearerAuth()
  @ApiQuery({
    name: 'latest',
    description: 'Latest blog',
    type: Boolean,
    required: false,
  })
  async findAll(@UserId() userId: string, @Query('latest') latest: boolean) {
    if (latest) {
      return this.blogService.latest();
    }
    return await this.blogService.findAll(userId);
  }

  @Get(':id')
  @Public()
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @UserId() userId: string) {
    return this.blogService.findOne(id, userId);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogService.update(id, updateBlogDto, file);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
