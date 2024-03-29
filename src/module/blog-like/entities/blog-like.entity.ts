import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Blog } from 'src/module/blog/entities/blog.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('blog_like')
export class BlogLike extends AbstractEntity {
  @ManyToOne(() => Blog, (blog) => blog.like, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
