import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
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
      relations: ['comments'],
    });

    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return post;
  }

  async create(body: CreatePostDto, userId: number) {
    return await this.postRepository.save({ ...body, userId });
  }

  async update(id: number, data: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    await this.postRepository.update(id, { ...data });

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
}
