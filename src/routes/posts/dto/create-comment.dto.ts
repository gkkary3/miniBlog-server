import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: '댓글 내용',
    example: '정말 좋은 게시글이네요! 감사합니다.',
    minLength: 1,
    maxLength: 200,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  content: string;

  @ApiProperty({
    description: '댓글이 달릴 게시글 ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @ApiProperty({
    description: '댓글 작성자 사용자 ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
