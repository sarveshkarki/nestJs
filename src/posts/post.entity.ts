import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostType } from './enums/postType.enum';
import { PostStatus } from './enums/postStatus.enum';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';

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

  tags?: string[];

  // Create unidirectional one-to-one relationship with MetaOption
  @OneToOne(() => MetaOption, (metaOptions) => metaOptions.post, {
    cascade: true,
    eager: true,
  }) // Specify the target entity
  // Indicates that this side owns the relationship and creates the foreign key in the Post table
  metaOptions?: MetaOption;

  @ManyToOne(() => User, (user) => user.posts)
  author: User | null;
}
