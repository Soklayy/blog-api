import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { IsUnique } from 'src/common/validations/is-unigue.validation';
import { User } from '../entities/user.entity';
import { Role } from 'src/common/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    type: () => String,
    required: true,
    example: 'Jhon',
  })
  @IsNotEmpty()
  @MinLength(3)
  firstname: string;

  @ApiProperty({
    type: () => String,
    required: true,
    example: 'Doo',
  })
  @IsNotEmpty()
  @MinLength(3)
  lastname: string;

  @ApiProperty({
    type: () => String,
    required: true,
    example: 'spiderman@email.com',
  })
  @IsEmail()
  @IsUnique([User])
  email: string;

  @ApiProperty({
    type: () => String,
    required: false,
    example: '2024-02-01',
  })
  @IsOptional()
  @IsDateString()
  birthdate: Date;

  @ApiProperty({
    type: () => String,
    required: true,
    example: '12345678',
  })
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
