import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import CreatePostDto from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/routes/auth/guards/jwt-auth.guard';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Get(':id/comments')
  @UseGuards(JwtAuthGuard)
  findComments(@Param('id') id: number) {
    return this.postsService.findComments(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreatePostDto) {
    return this.postsService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() body: UpdatePostDto) {
    console.log('postsController - update', id, body);
    return this.postsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: number) {
    return this.postsService.delete(id);
  }
}
