import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsExists } from 'src/common/validations/is-exists.validattion';
import { Blog } from 'src/module/blog/entities/blog.entity';

export class BlogLikeDto {
  @ApiProperty({
    type: () => String,
    required: true,
  })
  @IsNotEmpty()
  @IsExists([Blog, (args) => Object({ id: args.value })])
  blog: string;

  user: string;
}
