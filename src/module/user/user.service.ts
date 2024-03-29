import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { File } from '../file/entities/file.entity';
import { FileService } from '../file/file.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileService: FileService
  ) { }

  async create(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    let profileImage: null | File = null;
    try {
      if (file) {
        profileImage = await this.fileService.create(file);
      }

      const newUser = await this.userRepository.save(
        this.userRepository.create({ ...createUserDto, profileImage }),
      );

      return newUser;
    } catch (error) {
      if (profileImage) {
        await this.fileService.delete(profileImage.id);
      }
      throw error;
    }
  }

  async findAll() {
    return await this.userRepository.find({
      select: [
        'id',
        'firstname',
        'lastname',
        'email',
        'profileImage',
        'birthdate',
        'role',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }
    // delete user.logginProvider;
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email: email });
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    let profileImage: null | File = null;
    try {

      const user = await this.findOneById(id);

      // if (!updateUserDto.password) {
      //   delete user.password
      // }
      const userUpdate = new User()
      Object.assign(userUpdate, {
        id: user.id,
        ...updateUserDto
      })
      console.log(userUpdate)
      if (file) {
        if (user?.profileImage) {
          await this.fileService.update(user?.profileImage.id, file);
        } else {
          profileImage = await this.fileService.create(file);
          userUpdate.profileImage = profileImage
        }
      }

      const newuser = await this.userRepository.save(userUpdate)
      delete user?.password;
      console.log(Object.assign(user,newuser))
      return Object.assign(user,newuser);
    } catch (error) {
      if (profileImage) {
        await this.fileService.delete(profileImage.id);
      }
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  async remove(id: string) {
    const user = await this.findOneById(id);

    await this.userRepository.remove(user).catch((error) => {
      throw new BadRequestException(
        `Failed to delete User: ${user.firstname} ${user.lastname}`,
      );
    });

    if (user.profileImage) {
      await this.fileService.delete(user.profileImage.path);
    }

    return {
      message: `Deleted "${user.firstname} ${user.lastname}" from records`,
    };
  }
}
