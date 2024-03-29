import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { BlogComment } from 'src/module/blog-comment/entities/blog-comment.entity';
import { BlogLike } from 'src/module/blog-like/entities/blog-like.entity';
import { File } from 'src/module/file/entities/file.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('blogs')
export class Blog extends AbstractEntity {
  @Column({
    nullable: false,
    length: 125,
  })
  title: string;

  @Column({
    nullable: true,
    length: 300,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  article: string;

  @Column({
    name: 'is_public',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isPublic: boolean;

  @OneToOne(() => File)
  @JoinColumn({ name: 'thumbnail' })
  @OneToOne(() => File, { eager: true, cascade: true, onDelete: 'SET NULL' })
  thumbnail: File;

  @OneToMany(() => BlogComment, (comment) => comment.blog)
  comment: BlogComment[];

  @OneToMany(() => BlogLike, (like) => like.blog)
  like: BlogLike[];
}
