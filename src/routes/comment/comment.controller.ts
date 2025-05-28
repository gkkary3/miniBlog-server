import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteComment(@Param('id') id: number) {
    return this.commentService.deleteComment(id);
  }
}
