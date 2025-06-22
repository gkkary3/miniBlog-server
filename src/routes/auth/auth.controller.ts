import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entity/user.entity';
import { Response } from 'express';
import { SocialSignupDto } from './dto/social-signup.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: SignupUserDto })
  async signup(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signup(signupUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '로그아웃' })
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }

  @Post('refresh')
  @ApiOperation({ summary: '토큰 갱신' })
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '현재 로그인된 사용자 정보 조회' })
  me(@Request() req: any) {
    return req.user;
  }

  // Google OAuth 엔드포인트
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google 로그인 시작' })
  async googleAuth() {
    // Google OAuth 페이지로 리다이렉트
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google 로그인 콜백' })
  googleAuthCallback(@Request() req: any, @Res() res: Response) {
    const result = req.user as {
      accessToken?: string;
      refreshToken?: string;
      user?: User;
      isNewUser: boolean;
      email?: string;
      provider?: string;
      providerId?: string;
      profileImage?: string;
      tempUsername?: string;
    };

    if (result.isNewUser) {
      // 새 사용자 - 회원가입 페이지로 리다이렉트
      const signupData = encodeURIComponent(
        JSON.stringify({
          email: result.email,
          provider: result.provider,
          providerId: result.providerId,
          profileImage: result.profileImage,
          tempUsername: result.tempUsername,
        }),
      );
      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/social-signup?data=${signupData}`;
      res.redirect(redirectUrl);
    } else {
      // 기존 사용자 - 로그인 완료
      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`;
      res.redirect(redirectUrl);
    }
  }

  // Kakao OAuth 엔드포인트
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: 'Kakao 로그인 시작' })
  async kakaoAuth() {
    // Kakao OAuth 페이지로 리다이렉트
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: 'Kakao 로그인 콜백' })
  kakaoAuthCallback(@Request() req: any, @Res() res: Response) {
    const result = req.user as {
      accessToken?: string;
      refreshToken?: string;
      user?: User;
      isNewUser: boolean;
      email?: string;
      provider?: string;
      providerId?: string;
      profileImage?: string;
      tempUsername?: string;
    };

    if (result.isNewUser) {
      // 새 사용자 - 회원가입 페이지로 리다이렉트
      const signupData = encodeURIComponent(
        JSON.stringify({
          email: result.email,
          provider: result.provider,
          providerId: result.providerId,
          profileImage: result.profileImage,
          tempUsername: result.tempUsername,
        }),
      );
      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/social-signup?data=${signupData}`;
      res.redirect(redirectUrl);
    } else {
      // 기존 사용자 - 로그인 완료
      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`;
      res.redirect(redirectUrl);
    }
  }

  @Post('social-signup')
  @ApiOperation({ summary: '소셜 회원가입 완료' })
  @ApiBody({ type: SocialSignupDto })
  async socialSignup(
    @Body()
    body: SocialSignupDto,
  ) {
    return this.authService.completeSocialSignup(body);
  }
}
