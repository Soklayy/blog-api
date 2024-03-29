import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';
import { IsOptional } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
