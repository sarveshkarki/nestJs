import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PostType } from './enums/postType.enum';
import { PostStatus } from './enums/postStatus.enum';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 512,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: PostType,
    nullable: false,
    default: PostType.POST,
  })
  postType: string;

  @Column({
    unique: true,
    nullable: false,
    type: 'varchar',
    length: 256,
  })
  slug: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 1024,
  })
  featuredImage?: string;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  publishedOn?: Date;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  tags?: string[];

  @Column({
    nullable: true,
    type: 'varchar',
  })
  metaOptions?: string;
}
