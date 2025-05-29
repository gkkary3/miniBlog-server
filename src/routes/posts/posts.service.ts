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

  async findAll() {
    return await this.postRepository.find();
  }

  // async getPostsByUserId(userId: number) {
  //   return await this.postRepository.find({
  //     where: { id },
  //   });
  // }

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
    const post = await this.postRepository.findOneBy({ id });

    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return post.comments;
  }

  async createComment(id: number, body: CreateCommentDto) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return this.commentRepository.save({ ...body, postId: id });
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

  async getPostsByUserId(userId: number) {
    return await this.postRepository.find({
      where: { userId },
      relations: ['user'], // 필요시 user 정보도 포함
    });
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
