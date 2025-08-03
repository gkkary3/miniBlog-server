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
import { EmailService } from './services/email.service';
import { SendVerificationDto } from './dto/send-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  // 인증번호 임시 저장소 (메모리)
  private verificationCodes = new Map<
    string,
    { code: string; expiresAt: Date }
  >();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
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
    console.log(
      '🔄 generateRefreshToken - JWT_REFRESH_SECRET 값:',
      process.env.JWT_REFRESH_SECRET,
    );
    console.log(
      '🔄 generateRefreshToken - JWT_REFRESH_SECRET이 undefined인가?',
      process.env.JWT_REFRESH_SECRET === undefined,
    );
    return this.jwtService.sign(payload, {
      // secret: 'refresh_secret_key', // 다른 시크릿 키 사용
      secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
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

    console.log('🔑 login - JWT_SECRET 값:', process.env.JWT_SECRET);
    console.log(
      '🔑 login - JWT_REFRESH_SECRET 값:',
      process.env.JWT_REFRESH_SECRET,
    );

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    console.log(
      '🔑 login - 생성된 refreshToken:',
      refreshToken.substring(0, 20) + '...',
    );

    await this.userRepository.update(user.id, { refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }

  async signup(body: SignupUserDto) {
    const { username, email, userId, password } = body;
    const encryptedPassword = await this.encryptPassword(password);
    const user = await this.userRepository.findOne({
      where: { email },
    });

    const userIdCheck = await this.userRepository.findOne({
      where: { userId },
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    if (userIdCheck) {
      throw new HttpException('User ID already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.userRepository.create({
      username,
      userId,
      email,
      password: encryptedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);

    const payload = {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      userId: savedUser.userId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(savedUser.id);

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

  async me(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async refresh(refreshToken: string) {
    try {
      console.log(
        '🔄 refresh - 받은 refreshToken:',
        refreshToken.substring(0, 20) + '...',
      );
      console.log(
        '🔄 refresh - JWT_REFRESH_SECRET 값:',
        process.env.JWT_REFRESH_SECRET,
      );
      console.log(
        '🔄 refresh - JWT_REFRESH_SECRET이 undefined인가?',
        process.env.JWT_REFRESH_SECRET === undefined,
      );
      // refreshToken 검증
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
      });

      console.log('🔄 refresh - 토큰 검증 성공, payload:', payload);

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
        profileImage: user.profileImage,
        // username: socialUser.username,
        username: user.username,
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

  // 인증번호 발송
  async sendVerificationCode(sendVerificationDto: SendVerificationDto) {
    const { email } = sendVerificationDto;

    // 이미 가입된 이메일인지 확인
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException(
        '이미 가입된 이메일입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 6자리 랜덤 인증번호 생성
    const verificationCode = this.emailService.generateVerificationCode();

    // 5분 후 만료
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // 메모리에 저장
    this.verificationCodes.set(email, {
      code: verificationCode,
      expiresAt,
    });

    // 이메일 발송
    await this.emailService.sendVerificationEmail(email, verificationCode);

    return {
      success: true,
      message: '인증번호가 이메일로 발송되었습니다.',
      data: {
        email,
        expiresAt,
        expiresInMinutes: 5,
      },
    };
  }

  // 인증번호 확인
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, verificationCode } = verifyEmailDto;

    // 저장된 인증번호 확인
    const storedData = this.verificationCodes.get(email);

    if (!storedData) {
      throw new HttpException(
        '인증번호가 발송되지 않았거나 만료되었습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 만료 시간 확인
    if (new Date() > storedData.expiresAt) {
      this.verificationCodes.delete(email);
      throw new HttpException(
        '인증번호가 만료되었습니다. 다시 발송해주세요.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 인증번호 일치 확인
    if (storedData.code !== verificationCode) {
      throw new HttpException(
        '인증번호가 일치하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 인증 성공 시 저장소에서 제거
    this.verificationCodes.delete(email);

    return {
      success: true,
      message: '이메일 인증이 완료되었습니다.',
      data: {
        email,
        verified: true,
        verifiedAt: new Date(),
      },
    };
  }

  // 인증된 이메일인지 확인하는 헬퍼 메서드
  isEmailVerified(email: string): boolean {
    return !this.verificationCodes.has(email);
  }
}
