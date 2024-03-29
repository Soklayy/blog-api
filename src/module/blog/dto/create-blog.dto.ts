import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    type: () => String,
    required: true,
    example:
      'ទ្រូម៉ាន់នី កម្ពុជា និង Cambodian Superstar លោក​ វណ្ណដា សហការគ្នាដើម្បីលើ​ក​ស្ទួយ​យុវជនកម្ពុជា',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: () => String,
    required: false,
    example:
      'ទ្រូម៉ាន់នី កម្ពុជា និង Cambodian Superstar លោក​ វណ្ណដា សហការគ្នាដើម្បីលើ​ក​ស្ទួយ​យុវជនកម្ពុជា',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    type: () => String,
    required: true,
    example: `It's markdown text`,
  })
  @IsNotEmpty()
  article: string;

  @ApiProperty({
    type: () => Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isPublic must be a boolean value or string of boolean' })
  @Transform(({ value }) => {
    if (value == 'true' || value == 'false') return value == 'true';
    return value;
  })
  isPublic: boolean;
}
