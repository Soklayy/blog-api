import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";
import { IsSameAs } from "src/common/validations/is-same-as.validation";

export class ChangePasswordDto {
    @ApiProperty({
        type: () => String,
        required: true,
        example: '12345678',
    })
    @MinLength(8)
    @IsNotEmpty()
    newPassword: string;

    @ApiProperty({
        type: () => String,
        required: true,
        example: '12345678',
    })
    @MinLength(8)
    @IsNotEmpty()
    @IsSameAs('newPassword')
    confirmPassword: string;

    @ApiProperty({
        type: () => String,
        required: true,
        example: '12345678',
    })
    @MinLength(8)
    @IsNotEmpty()
    oldPassword: string;
}