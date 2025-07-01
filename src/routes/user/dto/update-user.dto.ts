import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: '수정할 사용자 이름',
    example: '홍길동',
    minLength: 2,
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 15)
  username: string;

  @ApiProperty({
    description: '수정할 사용자 ID (고유 식별자)',
    example: 'kkary',
    minLength: 3,
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 15)
  userId: string;
}
