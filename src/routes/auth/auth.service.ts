import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/routes/user/user.service';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialSignupDto } from './dto/social-signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      const match = await compare(password, user.password); // bcrypt로 비밀번호 비교
      if (match) {
        return plainToInstance(UserResponseDto, user, {
          excludeExtraneousValues: true,
        }); // 인증 성공
      } else {
        return null; // 비밀번호 틀림
      }
    }

    return null; // 사용자 없음
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const payload = { userId, type: 'refresh' };
    return this.jwtService.sign(payload, {
      secret: 'refresh_secret_key', // 다른 시크릿 키 사용
      expiresIn: '7d', // 7일
    });
  }

  async login(user: UserResponseDto) {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      userId: user.userId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    await this.userRepository.update(user.id, { refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }

  async signup(body: SignupUserDto) {
    console.log('🔍 Starting signup process...');
    console.log('🔍 Signup body:', JSON.stringify(body, null, 2));

    const { username, email, userId, password } = body;
    const encryptedPassword = await this.encryptPassword(password);

    console.log('🔍 Checking for existing user with email:', email);
    const user = await this.userRepository.findOne({
      where: { email },
    });

    console.log('🔍 Checking for existing user with userId:', userId);
    const userIdCheck = await this.userRepository.findOne({
      where: { userId },
    });

    if (user) {
      console.log('❌ User with email already exists:', email);
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    if (userIdCheck) {
      console.log('❌ User with userId already exists:', userId);
      throw new HttpException('User ID already exists', HttpStatus.BAD_REQUEST);
    }

    console.log('✅ No existing user found, creating new user...');
    const newUser = this.userRepository.create({
      username,
      userId,
      email,
      password: encryptedPassword,
    });

    console.log('🔍 Attempting to save user to database...');
    const savedUser = await this.userRepository.save(newUser);
    console.log('✅ User saved successfully:', savedUser.id);

    const payload = {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      userId: savedUser.userId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(savedUser.id);

    console.log('✅ Signup completed successfully');
    return {
      user: plainToInstance(UserResponseDto, savedUser),
      accessToken,
      refreshToken,
      excludeExtraneousValues: true,
    };
  }

  async logout(id: number) {
    await this.userRepository.update(id, { refreshToken: null });
    return {
      message: 'Logout successful. Refresh token has been invalidated.',
    };
  }

  async encryptPassword(password: string) {
    const DEFAULT_SALT = 11;
    return hash(password, DEFAULT_SALT);
  }

  async refresh(refreshToken: string) {
    try {
      // refreshToken 검증
      const payload = this.jwtService.verify(refreshToken, {
        secret: 'refresh_secret_key',
      });

      // DB에서 사용자 및 refreshToken 확인
      const user = await this.userRepository.findOne({
        where: { id: payload.id, refreshToken },
        select: ['id', 'email', 'userId', 'username', 'refreshToken'],
      });

      if (!user) {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 새로운 accessToken 발급
      const newAccessToken = this.jwtService.sign({
        id: user.id,
        email: user.email,
        username: user.username,
      });

      return { accessToken: newAccessToken };
    } catch {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  // 소셜 로그인 처리 메서드
  async handleSocialLogin(socialUser: {
    email: string;
    username: string;
    provider: string;
    providerId: string;
    profileImage?: string;
  }) {
    // 기존 사용자 확인 (provider와 providerId로)
    let user = await this.userRepository.findOne({
      where: {
        provider: socialUser.provider,
        providerId: socialUser.providerId,
      },
    });

    // 기존 사용자가 없다면 이메일로도 확인
    if (!user) {
      user = await this.userRepository.findOne({
        where: { email: socialUser.email },
      });
    }

    if (user) {
      // 기존 사용자 업데이트 (프로필 이미지 등)
      await this.userRepository.update(user.id, {
        profileImage: socialUser.profileImage,
        username: socialUser.username,
      });
      // JWT 토큰 생성
      const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        userId: user.userId,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = await this.generateRefreshToken(user.id);

      // refreshToken 저장
      await this.userRepository.update(user.id, { refreshToken });

      return {
        user: plainToInstance(UserResponseDto, user, {
          excludeExtraneousValues: true,
        }),
        accessToken,
        refreshToken,
        isNewUser: false,
      };
    } else {
      return {
        isNewUser: true,
        email: socialUser.email,
        provider: socialUser.provider,
        providerId: socialUser.providerId,
        profileImage: socialUser.profileImage,
        tempUsername: socialUser.username, // 임시 사용자명 (선택사항)
      };
    }
  }

  async completeSocialSignup(signupData: SocialSignupDto) {
    const { email, username, userId, provider, providerId, profileImage } =
      signupData;

    // userId 중복 확인
    const existingUser = await this.userRepository.findOne({
      where: { userId },
    });

    if (existingUser) {
      throw new HttpException(
        '이미 사용 중인 사용자 ID입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 새 사용자 생성
    const newUser = this.userRepository.create({
      email,
      username,
      userId,
      provider,
      providerId,
      profileImage,
      password: '', // 소셜 로그인은 비밀번호 없음
    });

    const savedUser = await this.userRepository.save(newUser);

    // JWT 토큰 생성
    const payload = {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      userId: savedUser.userId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(savedUser.id);
    await this.userRepository.update(savedUser.id, { refreshToken });

    return {
      user: plainToInstance(UserResponseDto, savedUser, {
        excludeExtraneousValues: true,
      }),
      accessToken,
      refreshToken,
    };
  }
}
