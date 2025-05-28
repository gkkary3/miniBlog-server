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
@ApiBearerAuth('JWT-auth')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.postsService.findAll();
  }

  @Get('@:userId')
  @UseGuards(JwtAuthGuard)
  async getPostsByUserId(@Param('userId') userId: string) {
    const cleanUserId = userId.startsWith('@') ? userId.slice(1) : userId;

    const user = await this.userService.getUserByUserId(cleanUserId);

    return this.postsService.getPostsByUserId(user.id);
  }

  @Get('@:userId/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Get('@:userId/:id/comments')
  @UseGuards(JwtAuthGuard)
  findComments(@Param('id') id: number) {
    return this.postsService.findComments(id);
  }

  @Post('@:userId/:id/comments')
  @UseGuards(JwtAuthGuard)
  createComment(@Param('id') id: number, @Body() body: CreateCommentDto) {
    console.log('postsController - createComment', id, body);
    return this.postsService.createComment(id, body);
  }

  @Put('@:userId/:id/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  updateComment(
    @Param('id') id: number,
    @Param('commentId') commentId: number,
    @Body() body: UpdateCommentDto,
  ) {
    return this.postsService.updateComment(id, commentId, body);
  }

  @Post('@:userId/write')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreatePostDto, @Request() req: any) {
    return this.postsService.create(body, req.user.id);
  }

  @Put('@:userId/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() body: UpdatePostDto) {
    console.log('postsController - update', id, body);
    return this.postsService.update(id, body);
  }

  @Delete('@:userId/:id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: number) {
    return this.postsService.delete(id);
  }
}
