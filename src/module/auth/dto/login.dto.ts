import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: () => String,
    required: true,
    example: 'spiderman@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: () => String,
    required: true,
    example: '12345678',
  })
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
