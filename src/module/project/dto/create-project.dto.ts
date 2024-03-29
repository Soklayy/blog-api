import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    type: () => String,
    required: true,
    example:
      'This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: () => String,
    required: false,
    example: `Currently, two official plugins are available: @vitejs/plugin-react uses Babel for Fast Refresh @vitejs/plugin-react-swc uses SWC for Fast Refresh`,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    type: () => String,
    required: false,
    example: 'https://github.com/Soklayy/Tamdan',
  })
  @IsOptional()
  resource: string;

  @ApiProperty({
    type: () => String,
    required: true,
    example: `It's markdown text`,
  })
  @IsNotEmpty()
  article: string;
}
