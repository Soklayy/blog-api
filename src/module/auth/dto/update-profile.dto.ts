import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, MinLength } from "class-validator";

export class UpdateProfileDto {
  @ApiProperty({
    type: () => String,
    required: false,
    example: 'Jhon',
  })
  @MinLength(3)
  @IsOptional()
  firstname: string;

  @ApiProperty({
    type: () => String,
    required: false,
    example: 'Doo',
  })
  @MinLength(3)
  @IsOptional()
  lastname: string;

  @ApiProperty({
    type: () => String,
    required: false,
    example: '2024-02-01',
  })
  @IsOptional()
  @IsDateString()
  birthdate: Date;
}
