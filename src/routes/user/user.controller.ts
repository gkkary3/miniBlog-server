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
// import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: '전체 사용자 조회',
    description: '모든 사용자 목록을 조회합니다.',
  })
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '특정 사용자 조회',
    description: '사용자 ID로 특정 사용자의 정보를 조회합니다.',
  })
  getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '사용자의 정보를 수정합니다.',
  })
  updateUser(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
    @Request() req: any,
  ) {
    const currentUserId = req.user.id;
    return this.userService.updateUser(id, body, currentUserId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '사용자 삭제',
    description: '사용자 계정을 삭제합니다.',
  })
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('@:userId/follow')
  @ApiOperation({
    summary: '사용자 팔로우',
    description: '사용자를 팔로우합니다.',
  })
  async followUser(@Param('userId') userId: string, @Request() req: any) {
    const cleanUserId = userId.startsWith('@') ? userId.slice(1) : userId;
    return this.userService.followUser(cleanUserId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete('@:userId/follow')
  @ApiOperation({
    summary: '사용자 언팔로우',
    description: '사용자를 언팔로우합니다.',
  })
  async unfollowUser(@Param('userId') userId: string, @Request() req: any) {
    const cleanUserId = userId.startsWith('@') ? userId.slice(1) : userId;
    console.log('cleanUserId:', cleanUserId);
    console.log('req.user.id:', req.user.id);
    return this.userService.unFollowUser(cleanUserId, req.user.id);
  }

  @Get('@:userId/followers')
  @ApiOperation({
    summary: '특정 사용자의 팔로워 조회',
    description: '특정 사용자의 팔로워 목록을 조회합니다.',
  })
  async getFollowers(
    @Param('userId') userId: string,
    @Query('currentUserId') currentUserId?: number,
  ) {
    const cleanUserId = userId.startsWith('@') ? userId.slice(1) : userId;
    return this.userService.getFollowers(cleanUserId, currentUserId);
  }

  @Get('@:userId/following')
  @ApiOperation({
    summary: '특정 사용자의 팔로잉 조회',
    description: '특정 사용자의 팔로잉 목록을 조회합니다.',
  })
  async getFollowing(
    @Param('userId') userId: string,
    @Query('currentUserId') currentUserId?: number,
  ) {
    const cleanUserId = userId.startsWith('@') ? userId.slice(1) : userId;
    return this.userService.getFollowing(cleanUserId, currentUserId);
  }

  @Get('@:userId/follow-status')
  @ApiOperation({
    summary: '특정 사용자 팔로우 상태 조회',
    description:
      '현재 로그인한 사용자가 특정 사용자를 팔로우하고 있는지 확인합니다.',
  })
  async getFollowStatus(
    @Param('userId') userId: string,
    @Query('currentUserId') currentUserId?: number,
  ) {
    const cleanUserId = userId.startsWith('@') ? userId.slice(1) : userId;
    const user = await this.userService.getUserByUserId(cleanUserId);
    return this.userService.getFollowStatus(user.id, Number(currentUserId));
  }
}
