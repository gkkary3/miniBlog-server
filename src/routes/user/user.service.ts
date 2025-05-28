// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { LoginUserDto } from './dto/login-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
// import { compare, hash } from 'bcrypt';
// import { plainToInstance } from 'class-transformer';
// import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    const users = await this.userRepository.find();
    return users;
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email'],
    });
  }

  async updateUser(id: number, body: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    await this.userRepository.update(id, body);

    return this.userRepository.findOneBy({ id });
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return this.userRepository.delete(id);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password'],
    });
  }
  async getUserByUserId(userId: string) {
    const user = await this.userRepository.findOne({
      where: { userId },
      select: ['id', 'username', 'email', 'userId'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
