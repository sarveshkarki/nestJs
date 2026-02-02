import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostService {
  constructor(
    // INJECTING USERS SERVICE IF NEEDED
    private readonly usersService: UsersService,

    // Inject posts repository
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    // Inject metaOptions repository
    @InjectRepository(MetaOption)
    public readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  // Creating new post
  public async create(createPostDto: CreatePostDto) {
    // Find author from database on authorId
    let author = await this.usersService.findOneById(createPostDto.authorId);
    // Create post
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
    });

    // return the post
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: number) {
    let post = await this.postsRepository.find();
    return post;
  }

  public async delete(id: number) {
    // Delete the post
    await this.postsRepository.delete(id);

    // Confirm deletion
    return { deleted: true, id };
  }
}
