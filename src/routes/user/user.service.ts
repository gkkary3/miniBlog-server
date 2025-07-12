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

  async updateUser(id: number, body: UpdateUserDto, currentUserId: number) {
    if (id !== currentUserId) {
      throw new HttpException(
        '자신의 정보만 수정할 수 있습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    if (user.userId != body.userId) {
      const existingUser = await this.userRepository.findOneBy({
        userId: body.userId,
      });
      if (existingUser) {
        throw new HttpException(
          '이미 사용 중인 아이디입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await this.userRepository.update(id, body);

    return this.userRepository.findOneBy({ id });
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['followers', 'following', 'likedPosts'],
    });

    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    // ManyToMany 관계 정리 (CASCADE DELETE로 처리되지 않음)
    user.followers = [];
    user.following = [];
    user.likedPosts = [];
    await this.userRepository.save(user);

    // 사용자 삭제 (데이터베이스 CASCADE로 posts, comments 자동 삭제)
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

  async getFollowStatus(userId: number, currentUserId?: number) {
    if (!currentUserId) {
      return {
        isFollowing: false,
      };
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['following'],
    });

    if (!currentUser) {
      throw new HttpException('Current user not found', HttpStatus.NOT_FOUND);
    }

    return {
      isFollowing: currentUser.following.some((f) => f.id === userId),
    };
  }
}
