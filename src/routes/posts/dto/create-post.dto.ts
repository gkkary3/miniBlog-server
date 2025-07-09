import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayMaxSize,
} from 'class-validator';
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

  @ApiProperty({
    description: '게시글 카테고리',
    example: ['1', '2', '3'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @ApiProperty({
    description: '게시글 이미지 URL 배열 (최대 100개)',
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

  @ApiProperty({
    description: '게시글 썸네일 이미지 URL',
    example:
      'https://miniblog-uploads-1.s3.ap-southeast-2.amazonaws.com/uploads/thumbnail-1234567890.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;
}
