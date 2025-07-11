import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupUserDto {
  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
    minLength: 2,
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 15)
  username: string;

  @ApiProperty({
    description: '이메일 주소',
    example: 'user@example.com',
    minLength: 10,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(5, 100)
  email: string;

  @ApiProperty({
    description: '사용자 ID (고유 식별자)',
    example: 'kkary',
    minLength: 3,
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 15)
  userId: string;

  @ApiProperty({
    description: '비밀번호 (8자 이상, 영문, 숫자, 특수문자 포함)',
    example: 'MyPassword123!',
    minLength: 8,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 100)
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
    {
      message:
        '비밀번호는 8자 이상이며, 영문, 숫자, 특수문자(!@#$%^&*(),.?":{}|<>)를 각각 하나 이상 포함해야 합니다.',
    },
  )
  password: string;
}
