import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@ApiTags('comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '댓글 삭제', description: '댓글을 삭제합니다.' })
  deleteComment(@Param('id') id: number) {
    return this.commentService.deleteComment(id);
  }
}
