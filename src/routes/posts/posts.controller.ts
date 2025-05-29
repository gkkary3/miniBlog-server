import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import CreatePostDto from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/routes/auth/guards/jwt-auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserService } from '../user/user.service';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UserService,
  ) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('@:userId')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  async getPostsByUserId(@Param('userId') userId: string) {
    const cleanUserId = userId.startsWith('@') ? userId.slice(1) : userId;

    const user = await this.userService.getUserByUserId(cleanUserId);

    return this.postsService.getPostsByUserId(user.id);
  }

  @Get('@:userId/:id')
  // @ApiBearerAuth('JWT-auth')
  // @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Post('@:userId/write')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreatePostDto, @Request() req: any) {
    return this.postsService.create(body, req.user.id);
  }

  @Put('@:userId/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() body: UpdatePostDto) {
    console.log('postsController - update', id, body);
    return this.postsService.update(id, body);
  }

  @Delete('@:userId/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: number) {
    return this.postsService.delete(id);
  }

  @Get('@:userId/:id/comments')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findComments(@Param('id') id: number) {
    return this.postsService.findComments(id);
  }

  @Post('@:userId/:id/comments')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  createComment(@Param('id') id: number, @Body() body: CreateCommentDto) {
    console.log('postsController - createComment', id, body);
    return this.postsService.createComment(id, body);
  }

  @Put('@:userId/:id/comments/:commentId')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  updateComment(
    @Param('id') id: number,
    @Param('commentId') commentId: number,
    @Body() body: UpdateCommentDto,
  ) {
    return this.postsService.updateComment(id, commentId, body);
  }

  @Get('@:userId/:id/likes')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  getLikes(@Param('id') id: number, @Request() req: any) {
    return this.postsService.getLikes(id, req.user.id);
  }

  @Post('@:userId/:id/like')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  likePost(@Param('id') id: number, @Request() req: any) {
    console.log('postsController - likePost', id, req.user.id);
    return this.postsService.likePost(id, req.user.id);
  }

  @Delete('@:userId/:id/like')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  unlikePost(@Param('id') id: number, @Request() req: any) {
    return this.postsService.unlikePost(id, req.user.id);
  }
}
