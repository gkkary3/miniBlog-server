import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import { Category } from 'src/entity/category.entity';
import { Repository } from 'typeorm';
import CreatePostDto from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from 'src/entity/comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SearchPostsDto, SortType } from './dto/search-posts.dto';
import { GetUserPostsDto } from './dto/get-user-posts.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async searchPosts(searchDto: SearchPostsDto) {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.likedUsers', 'likedUser')
      .leftJoinAndSelect('post.comments', 'comments');

    if (searchDto.search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search OR post.username ILIKE :search OR categories.name ILIKE :search OR user.userId ILIKE :search)',
        { search: `%${searchDto.search}%` },
      );
    }

    if (searchDto.sortBy === SortType.LATEST) {
      queryBuilder.orderBy('post.createdAt', 'DESC');
    } else if (searchDto.sortBy === SortType.LIKES) {
      queryBuilder
        .addSelect((subQuery) => {
          return subQuery
            .select('COUNT(*)')
            .from('post_liked_users_user', 'plu')
            .where('plu."postId" = post.id');
        }, 'likescount')
        .orderBy('likescount', 'DESC');
    } else if (searchDto.sortBy === SortType.COMMENTS) {
      queryBuilder
        .addSelect((subQuery) => {
          return subQuery
            .select('COUNT(*)')
            .from('comment', 'c')
            .where('c."postId" = post.id');
        }, 'commentscount')
        .orderBy('commentscount', 'DESC');
    }

    if (searchDto.page && searchDto.limit) {
      queryBuilder.skip((searchDto.page - 1) * searchDto.limit);
      queryBuilder.take(searchDto.limit);
    }

    const [posts, total] = await queryBuilder.getManyAndCount();

    return {
      posts,
      total,
      page: searchDto.page || 1,
      limit: searchDto.limit || 10,
      totalPages: Math.ceil(total / (searchDto.limit || 10)),
    };
  }

  async findAll(page: number = 1, limit: number = 10) {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.likedUsers', 'likedUser')
      .select([
        'post', // Post의 모든 필드
        'user.userId', // 작성자의 userId
        'user.email', // 작성자의 email
        'likedUser.id', // 좋아요 누른 사용자들의 id만
        'likedUser.userId', // 좋아요 누른 사용자들의 userId만
      ])
      .orderBy('post.createdAt', 'DESC');

    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    const [posts, total] = await queryBuilder.getManyAndCount();

    return {
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['comments', 'likedUsers', 'categories'],
    });

    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return post;
  }

  async create(body: CreatePostDto, userId: number, username: string) {
    const { categories, ...postData } = body;
    console.log(body);
    // categories 문자열 배열을 Category 엔티티로 변환
    const categoryEntities: Category[] = [];
    if (categories && categories.length > 0) {
      // 각 카테고리 이름으로 Category 엔티티를 찾거나 생성
      for (const categoryName of categories) {
        let category = await this.categoryRepository.findOne({
          where: { name: categoryName },
        });

        // 카테고리가 존재하지 않으면 새로 생성
        if (!category) {
          category = this.categoryRepository.create({ name: categoryName });
          category = await this.categoryRepository.save(category);
        }

        categoryEntities.push(category);
      }
    }

    const post = this.postRepository.create({
      ...postData,
      userId,
      username,
      categories: categoryEntities,
    });

    return await this.postRepository.save(post);
  }

  async update(id: number, data: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    const { categories, ...updateData } = data;

    // categories가 포함된 경우 Category 엔티티로 변환
    if (categories) {
      const categoryEntities: Category[] = [];
      for (const categoryName of categories) {
        let category = await this.categoryRepository.findOne({
          where: { name: categoryName },
        });

        // 카테고리가 존재하지 않으면 새로 생성
        if (!category) {
          category = this.categoryRepository.create({ name: categoryName });
          category = await this.categoryRepository.save(category);
        }

        categoryEntities.push(category);
      }

      // 게시글 업데이트 (categories 포함)
      await this.postRepository.save({
        ...post,
        ...updateData,
        categories: categoryEntities,
      });
    } else {
      // categories가 없는 경우 일반 업데이트
      await this.postRepository.update(id, updateData);
    }

    return this.postRepository.findOneBy({ id });
  }

  async delete(id: number) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return await this.postRepository.delete(id);
  }

  async findComments(id: number) {
    const comments = await this.commentRepository.find({
      where: { postId: id },
      relations: ['user'],
    });

    if (!comments) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return comments;
  }

  async createComment(id: number, body: CreateCommentDto, userId: number) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return this.commentRepository.save({ ...body, postId: id, userId });
  }

  async updateComment(id: number, commentId: number, body: UpdateCommentDto) {
    const comment = await this.commentRepository.findOneBy({
      id: commentId,
      postId: id,
    });

    if (!comment) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    await this.commentRepository.update(commentId, { ...body });

    return this.commentRepository.findOneBy({ id: commentId });
  }

  async getPostsByUserId(userId: number, queryDto: GetUserPostsDto) {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const search = queryDto.search;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.categories', 'categories')
      .where('post.userId = :userId', { userId })
      .orderBy('post.createdAt', 'DESC');

    // 검색 조건 추가 (있을 때만)
    if (queryDto.search && queryDto.search.trim()) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search OR categories.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // 페이지네이션 적용
    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    const [posts, total] = await queryBuilder.getManyAndCount();

    // 댓글/좋아요 수 계산
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [commentCount, likeCount] = await Promise.all([
          this.commentRepository.count({ where: { postId: post.id } }),
          this.postRepository
            .createQueryBuilder('post')
            .innerJoin('post.likedUsers', 'likedUsers')
            .where('post.id = :postId', { postId: post.id })
            .getCount(),
        ]);

        return { ...post, commentCount, likeCount };
      }),
    );

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followers', 'following'],
    });

    const followerCount = user?.followers?.length ?? 0;
    const followingCount = user?.following?.length ?? 0;

    return {
      user,
      posts: postsWithCounts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      searchTerm: search || null, // 클라이언트에서 현재 검색어 확인용
      followerCount,
      followingCount,
    };
  }

  async getLikes(id: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['likedUsers'],
    });

    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    const isLiked = post.likedUsers.some((user) => user.id === userId);

    return {
      ...post,
      isLiked,
      likeCount: post.likedUsers.length,
    };
  }
  async likePost(id: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['likedUsers'],
    });

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!post || !user)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    if (post.likedUsers.find((u) => u.id === userId))
      return { message: 'Already liked' };

    post.likedUsers.push(user);
    await this.postRepository.save(post);
    return { message: 'Post liked' };
  }

  async unlikePost(id: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['likedUsers'],
    });

    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    post.likedUsers = post.likedUsers.filter((u) => u.id !== userId);
    await this.postRepository.save(post);
    return { message: 'Post unliked' };
  }
}
