import { genSaltSync, hashSync } from 'bcrypt';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Role } from 'src/common/enums/role.enum';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { File } from '../../file/entities/file.entity';
import { LogginProvider } from 'src/common/enums/loggin.enum';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({
    transformer: {
      to(value) {
        return hashSync(value, genSaltSync(10, 'b'));
      },
      from(value) {
        return value;
      },
    },
  })
  @ApiHideProperty()
  password: string;

  @Column({ type: 'date', nullable: true, default: null })
  birthdate: Date;

  @JoinColumn({ name: 'profile_image' })
  @OneToOne(() => File, { eager: true, cascade: true, onDelete: 'SET NULL' })
  profileImage: File;

  @Column({ default: Role.USER, type: 'enum', enum: Role })
  role: Role;

  @Column({
    type: 'enum',
    enum: LogginProvider,
    default: LogginProvider.LOCAL,
    name: 'loggin_provider',
  })
  logginProvider: LogginProvider;
}
