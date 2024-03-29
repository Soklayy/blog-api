import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Blog } from '../../blog/entities/blog.entity';
import { User } from 'src/module/user/entities/user.entity';

@Entity('blog_comments')
export class BlogComment extends AbstractEntity {
  @Column({
    length: 500,
  })
  comment: string;

  @ManyToOne(() => Blog, (blog) => blog.comment, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @ManyToOne(() => User, { onDelete: 'SET NULL', cascade: true })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;
}
