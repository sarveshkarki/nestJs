import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/provider/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';

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

    // Injecting Pagination Provider
    private readonly paginationProvider: PaginationProvider,
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

  public async findAll(postQuery: GetPostsDto): Promise<Paginated<Post>> {
    let posts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postsRepository,
    );
    return posts;
  }

  public async findOne(id: number) {
    let post = await this.postsRepository.findOneBy({ id });
    return post;
  }

  public async update(patchPostDto: PatchPostDto) {
    let post;

    // Find the post
    try {
      post = await this.postsRepository.findOneBy({ id: patchPostDto.id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later.',
      );
    }

    if (!post) {
      throw new NotFoundException(`Post with id ${patchPostDto.id} not found`);
    }

    // Handle tags ONLY if provided
    if (patchPostDto.tags) {
      let tags;

      try {
        tags = await this.tagsService.findMultipleTags(patchPostDto.tags);

        console.log(
          'FOUND TAGS:',
          tags.map((t) => t.id),
        );
        console.log('FOUND TAGS LENGTH:', tags.length);
        console.log('REQUESTED TAGS LENGTH:', patchPostDto.tags.length);
      } catch (error) {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment. Please try later.',
        );
      }
      console.log('PATCH DTO TAGS:', patchPostDto.tags);
      if (tags.length !== patchPostDto.tags.length) {
        throw new BadRequestException(
          'Please check your tag ids and ensure they are correct.',
        );
      }

      post.tags = tags;
    }

    // Update other fields
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // Save
    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later.',
      );
    }

    return post;
  }

  public async delete(id: number) {
    // Delete the post
    await this.postsRepository.delete(id);

    // Confirm deletion
    return { deleted: true, id };
  }
}
