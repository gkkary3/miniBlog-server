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
      select: ['id', 'username', 'email', 'password', 'userId'],
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

  async followUser(userId: string, followerId: number) {
    const targetUser = await this.userRepository.findOne({
      where: { userId },
      relations: ['followers'],
    });

    const follower = await this.userRepository.findOne({
      where: { id: followerId },
      relations: ['following'],
    });

    if (!follower || !targetUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (targetUser.id === followerId) {
      throw new HttpException(
        'You cannot follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (targetUser.followers.some((user) => user.id === followerId)) {
      throw new HttpException('Already following', HttpStatus.BAD_REQUEST);
    }

    targetUser.followers.push(follower);
    await this.userRepository.save(targetUser);

    return { message: 'Followed successfully' };
  }

  async unFollowUser(userId: string, followerId: number) {
    const targetUser = await this.userRepository.findOne({
      where: { userId },
      relations: ['followers'],
    });

    const follower = await this.userRepository.findOne({
      where: { id: followerId },
      relations: ['following'],
    });

    if (!follower || !targetUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (targetUser.id === followerId) {
      throw new HttpException(
        'You cannot follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!targetUser.followers.some((user) => user.id === followerId)) {
      throw new HttpException(
        'Not following this user',
        HttpStatus.BAD_REQUEST,
      );
    }

    targetUser.followers = targetUser.followers.filter(
      (user) => user.id !== followerId,
    );

    await this.userRepository.save(targetUser);

    return { message: 'Unfollowed successfully' };
  }

  async getFollowers(userId: string, currentUserId?: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['followers'],
    });

    if (!currentUserId) {
      return user?.followers?.map((follower) => ({
        ...follower,
        isFollowing: false,
      }));
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['following'],
    });

    if (!user || !currentUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const followersWithIsFollowing = user.followers.map((follower) => ({
      ...follower,
      isFollowing: currentUser.following.some((f) => f.id === follower.id),
    }));

    return followersWithIsFollowing;
  }

  async getFollowing(userId: string, currentUserId?: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['following'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!currentUserId) {
      return user.following.map((following) => ({
        ...following,
        isFollowing: false,
      }));
    }
    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['following'],
    });

    if (!currentUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const followingWithIsFollowing = user.following.map((following) => ({
      ...following,
      isFollowing: currentUser.following.some((f) => f.id === following.id),
    }));

    return followingWithIsFollowing;
  }
}
