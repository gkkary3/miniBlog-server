import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiOperation({
    summary: '사용자 로그인',
    description: '이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.',
  })
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  @ApiOperation({
    summary: '사용자 회원가입',
    description: '새로운 사용자 계정을 생성합니다.',
  })
  async signup(@Body() user: SignupUserDto) {
    return this.authService.signup(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '사용자 로그아웃',
    description:
      '현재 로그인된 사용자를 로그아웃하고 refresh token을 무효화합니다.',
  })
  async logout(@Request() req: any) {
    return this.authService.logout(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '사용자 프로필 조회',
    description: '현재 로그인된 사용자의 프로필 정보를 조회합니다.',
  })
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'JWT 토큰 갱신',
    description:
      'Refresh token을 사용하여 새로운 JWT 액세스 토큰을 발급받습니다.',
  })
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '사용자 정보 조회',
    description: '현재 로그인된 사용자의 정보를 조회합니다.',
  })
  me(@Request() req: any) {
    return req.user;
  }
}
