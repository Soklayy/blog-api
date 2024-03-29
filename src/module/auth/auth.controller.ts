import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { GoogleAuthGuard } from '../../common/guard/google-auth.guard';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserId } from 'src/common/decorators/user-id.dcorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangePasswordDto } from './dto/change-password.dto';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('/register')
  @UseInterceptors(FileInterceptor('profileImage'))
  register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }

  @ApiBearerAuth()
  @ApiOkResponse({})
  @Get('profile')
  getProfile(@UserId() id: string) {
    return this.authService.profile(id);
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogle(@Req() req, @Res() res: Response) {
    const token = await this.authService.loginSocialMedia(req.user.data);
    res.redirect(
      `${this.configService.get<string>('REDIRECT_TO_FRONEND')}?token=${token}`,
    );
  }

  @ApiBearerAuth()
  @Patch('profile')
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateProfile(
    @UserId() id:string,
    @Body() updateProfile: UpdateProfileDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.authService.updateProfile(id, updateProfile, file);
  }

  @ApiBearerAuth()
  @Patch('profile/change-password')
  async changePassword(
    @UserId() id:string,
    @Body() changePasswordDto: ChangePasswordDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.authService.changePassword(id, changePasswordDto);
  }
}
