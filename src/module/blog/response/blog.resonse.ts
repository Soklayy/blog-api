import { ApiProperty } from '@nestjs/swagger';

export abstract class Commons {
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  article: string;
  @ApiProperty()
  isPublic: boolean;
}

export class BlogResponseArray extends Commons {
  @ApiProperty({
    type: () => Comment,
    isArray: true,
  })
  comment: Comment[];
  @ApiProperty({
    type: () => Thumbnail,
  })
  thumbnail: any;
  @ApiProperty()
  like: number;
}

export class BlogResponse extends Commons {}

export class Comment {
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  comment: string;

  @ApiProperty({
    type: () => Users,
  })
  user: any;
}

export class Users {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty({
    type: () => Thumbnail,
  })
  profileImage: any;
}

export class Thumbnail {
  @ApiProperty()
  url: string;
}
