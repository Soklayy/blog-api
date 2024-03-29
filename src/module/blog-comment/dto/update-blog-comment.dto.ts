import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateBlogCommentDto {
  @ApiProperty({
    description: 'comment',
    example: 'Nice blog',
    required: false,
  })
  @IsOptional()
  comment: string;
}
