import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

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

    // Inject tags service
    private readonly tagsService: TagsService,
  ) {}

  // Creating new post
  public async create(createPostDto: CreatePostDto) {
    // Find author from database on authorId
    let author = await this.usersService.findOneById(createPostDto.authorId);
    // Find Tags
    let tags = await this.tagsService.findMultipleTags(
      createPostDto.tags ?? [],
    );

    // Create post
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    // return the post
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: number) {
    let post = await this.postsRepository.find({
      relations: {
        // tags: true,
      },
    });
    return post;
  }

  public async update(patchPostDto: PatchPostDto) {
    // Find the tags
    let tags = await this.tagsService.findMultipleTags(patchPostDto.tags ?? []);
    // Find the post
    let post = await this.postsRepository.findOneBy({ id: patchPostDto.id });

    if (!post) {
      throw new NotFoundException(`Post with id ${patchPostDto.id} not found`);
    }

    // Update the properties
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post?.content;
    post.status = patchPostDto.status ?? post?.status;
    post.postType = patchPostDto.postType ?? post?.postType;
    post.slug = patchPostDto.slug ?? post?.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post?.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post?.publishOn;

    // Assign the new tags
    post.tags = tags;
    // Save the post and return
    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    // Delete the post
    await this.postsRepository.delete(id);

    // Confirm deletion
    return { deleted: true, id };
  }
}
