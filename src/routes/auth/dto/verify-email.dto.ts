import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    description: '인증할 이메일 주소',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '6자리 인증번호',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  verificationCode: string;
}
