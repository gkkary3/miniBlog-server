import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: '로그인용 이메일 주소',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '로그인용 비밀번호',
    example: 'password123!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  // @ApiPropertyOptional({
  //   description: '사용자 이름 (선택사항)',
  //   example: '홍길동',
  // })
  // @IsOptional()
  // @IsString()
  // username: string;
}
