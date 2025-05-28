import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import CreatePostDto from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll() {
    return await this.postRepository.find();
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return post;
  }

  async findComments(id: number) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return post.comments;
  }

  async create(body: CreatePostDto) {
    return await this.postRepository.save(body);
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
}
