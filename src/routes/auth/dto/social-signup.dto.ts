import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SocialSignupDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: '사용자 지정 ID',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: '소셜 로그인 제공자',
    example: 'google',
  })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({
    description: '소셜 플랫폼에서 제공하는 고유 ID',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  profileImage?: string;
}
