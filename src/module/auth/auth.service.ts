import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { GoogleLogginPayload } from './dto/google-login-payload';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { LogginProvider } from 'src/common/enums/loggin.enum';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtServivce: JwtService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async register(registerDto: RegisterDto, file?: Express.Multer.File) {
    const user = await this.userService.create(registerDto, file);
    return {
      accessToken: this.jwtServivce.sign({ id: user.id }),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (
      !user ||
      !compareSync(loginDto.password, user.password) ||
      user.logginProvider !== LogginProvider.LOCAL
    ) {
      throw new BadRequestException('Wrong credential');
    }

    return {
      accessToken: this.jwtServivce.sign({ id: user.id }),
    };
  }

  async profile(id: string) {
    const user = await this.userService.findOneById(id);
    delete user.password;
    return user;
  }

  async loginSocialMedia(payload: GoogleLogginPayload) {
    const user = await this.userRepo.findOneBy({ email: payload.email });

    if (user) {
      return this.jwtServivce.sign({ ...user });
    }

    const newUser = await this.userRepo.save(
      this.userRepo.create({
        ...payload,
        password: '',
        birthdate: null,
        logginProvider: LogginProvider.GOOGLE,
      }),
    );

    return this.jwtServivce.sign({ id: newUser.id });
  }

  async updateProfile(
    id: string,
    updateProfile: UpdateProfileDto,
    file: Express.Multer.File,
  ) {
    return await this.userService.update(id, updateProfile, file);
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.userService.findOneById(id);
    if (!compareSync(changePasswordDto.oldPassword, user.password)) {
      throw new BadRequestException('Incorrect password');
    }
    return await this.userService.update(id, { password: changePasswordDto.newPassword });
  }
}
