import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    description: '수정할 댓글 내용',
    example: '수정된 댓글 내용입니다. 더 자세한 의견을 추가했습니다.',
    minLength: 1,
    maxLength: 200,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  content: string;
}
