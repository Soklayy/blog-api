import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidationArguments } from 'class-validator';
import { IsExists } from 'src/common/validations/is-exists.validattion';
import { Blog } from 'src/module/blog/entities/blog.entity';
import { User } from 'src/module/user/entities/user.entity';
export class CreateBlogCommentDto {
  @ApiProperty({
    type: () => String,
    description: `blog's id`,
    example: '61a9b785-e12c-11ee-9de5-581122827d5f',
    required: true,
  })
  @IsNotEmpty()
  @IsExists([Blog, (args: ValidationArguments) => Object({ id: args.value })])
  blog: Blog;

  @ApiProperty({
    type: () => String,
    description: 'comment',
    example: 'Nice blog',
    required: true,
  })
  @IsNotEmpty()
  comment: string;

  user: User;
}
