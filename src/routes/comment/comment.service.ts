import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Comment } from 'src/entity/comments.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async deleteComment(id: number) {
    const comment = await this.commentRepository.findOneBy({ id });

    if (!comment) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return this.commentRepository.delete(id);
  }
}
