import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: '댓글 내용',
    example: '정말 좋은 게시글이네요! 감사합니다.',
    minLength: 1,
    maxLength: 500,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  content: string;
}
