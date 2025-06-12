// src/routes/posts/dto/search-posts.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

export enum SortType {
  LATEST = 'latest',
  LIKES = 'likes',
  COMMENTS = 'comments',
}

export class SearchPostsDto {
  @ApiPropertyOptional({
    description: '검색어 (제목, 내용, 카테고리, 작성자, 작성자ID 통합 검색)',
    example: '맛집',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: '페이지 번호 (1부터 시작)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '한 페이지당 게시글 수 (최대 100개)',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: '정렬 기준',
    enum: SortType,
    example: SortType.LATEST,
    default: SortType.LATEST,
  })
  @IsOptional()
  @IsEnum(SortType)
  sortBy?: SortType = SortType.LATEST;
}
