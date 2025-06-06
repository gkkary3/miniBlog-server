import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: '사용자 고유 ID',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  @Expose()
  username: string;

  @ApiProperty({
    description: '사용자 지정 ID',
    example: 'user123',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  @Expose()
  email: string;
}
