import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('projects')
export class Project extends AbstractEntity {
  @Column({ nullable: false })
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  article: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  resource: string;
}
