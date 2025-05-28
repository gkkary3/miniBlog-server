import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreatePostDto {
  @ApiProperty({
    description: '게시글 제목',
    example: '안녕하세요! 첫 번째 게시글입니다.',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '게시글 내용',
    example: '이것은 게시글의 내용입니다. 여러분의 의견을 자유롭게 남겨주세요!',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
