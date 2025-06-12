import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import CreatePostDto from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/routes/auth/guards/jwt-auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SearchPostsDto } from './dto/search-posts.dto';
import { UserService } from '../user/user.service';
import { GetUserPostsDto } from './dto/get-user-posts.dto';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '게시글 검색',
    description:
      '제목, 내용, 작성자, 카테고리 등 다양한 조건으로 게시글을 검색합니다.',
  })
  searchPosts(@Query() searchDto: SearchPostsDto) {
    return this.postsService.searchPosts(searchDto);
  }

  // @Get()
  // @ApiOperation({
  //   summary: '전체 게시글 조회',
  //   description: '모든 게시글 목록을 조회합니다.',
  // })
  // findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
  //   return this.postsService.findAll(page, limit);
  // }

  @Get('@:userId')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '특정 사용자 게시글 조회',
    description: '특정 사용자가 작성한 모든 게시글을 조회합니다.',
  })
  async getPostsByUserId(
    @Param('userId') userId: string,
    @Query() queryDto: GetUserPostsDto,
  ) {
    const cleanUserId = userId.startsWith('@') ? userId.slice(1) : userId;

    const user = await this.userService.getUserByUserId(cleanUserId);

    return this.postsService.getPostsByUserId(user.id, queryDto);
  }

  @Get('@:userId/:id')
  @ApiOperation({
    summary: '게시글 상세 조회',
    description: '특정 게시글의 상세 내용을 조회합니다.',
  })
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Post('@:userId/write')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '게시글 작성',
    description: '새로운 게시글을 작성합니다.',
  })
  create(@Body() body: CreatePostDto, @Request() req: any) {
    console.log('postsController - create', body);
    return this.postsService.create(body, req.user.id, req.user.username);
  }

  @Put('@:userId/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '게시글 수정',
    description: '기존 게시글을 수정합니다.',
  })
  update(@Param('id') id: number, @Body() body: UpdatePostDto) {
    console.log('postsController - update', id, body);
    return this.postsService.update(id, body);
  }

  @Delete('@:userId/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '게시글 삭제', description: '게시글을 삭제합니다.' })
  delete(@Param('id') id: number) {
    return this.postsService.delete(id);
  }

  @Get('@:userId/:id/comments')
  @ApiOperation({
    summary: '게시글 댓글 조회',
    description: '특정 게시글의 모든 댓글을 조회합니다.',
  })
  findComments(@Param('id') id: number) {
    return this.postsService.findComments(id);
  }

  @Post('@:userId/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '댓글 작성',
    description: '게시글에 새 댓글을 작성합니다.',
  })
  createComment(
    @Param('id') id: number,
    @Body() body: CreateCommentDto,
    @Request() req: any,
  ) {
    console.log('postsController - createComment', id, body);
    return this.postsService.createComment(id, body, req.user.id);
  }

  @Put('@:userId/:id/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '댓글 수정',
    description: '기존 댓글을 수정합니다.',
  })
  updateComment(
    @Param('id') id: number,
    @Param('commentId') commentId: number,
    @Body() body: UpdateCommentDto,
  ) {
    return this.postsService.updateComment(id, commentId, body);
  }

  @Get('@:userId/:id/likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '게시글 좋아요 조회',
    description: '게시글의 좋아요 정보를 조회합니다.',
  })
  getLikes(@Param('id') id: number, @Request() req: any) {
    return this.postsService.getLikes(id, req.user.id);
  }

  @Post('@:userId/:id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '게시글 좋아요',
    description: '게시글에 좋아요를 추가합니다.',
  })
  likePost(@Param('id') id: number, @Request() req: any) {
    console.log('postsController - likePost', id, req.user.id);
    return this.postsService.likePost(id, req.user.id);
  }

  @Delete('@:userId/:id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '게시글 좋아요 취소',
    description: '게시글의 좋아요를 취소합니다.',
  })
  unlikePost(@Param('id') id: number, @Request() req: any) {
    return this.postsService.unlikePost(id, req.user.id);
  }
}
