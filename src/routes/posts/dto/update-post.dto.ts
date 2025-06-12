import { PartialType } from '@nestjs/mapped-types';
import CreatePostDto from './create-post.dto';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: '수정할 게시글 제목',
    example: '수정된 게시글 제목입니다.',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '수정할 게시글 내용',
    example: '수정된 게시글 내용입니다. 더 자세한 정보를 추가했습니다.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: '게시글 카테고리',
    example: ['1', '2', '3'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @ApiProperty({
    description: '수정할 게시글 이미지 URL 배열 (최대 100개)',
    example: [
      'http://localhost:4000/uploads/image-1234567890-123456789.jpg',
      'http://localhost:4000/uploads/image-1234567890-987654321.png',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  images?: string[];
}
