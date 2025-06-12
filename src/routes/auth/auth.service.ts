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
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}
