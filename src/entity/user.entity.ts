import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Post } from './post.entity';
import { Exclude } from 'class-transformer';
import { Comment } from './comments.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  userId: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  provider: string; // 'local', 'google', 'kakao'

  @Column({ nullable: true })
  providerId: string; // 소셜 플랫폼에서 제공하는 고유 ID

  @Column({ nullable: true })
  profileImage: string; // 소셜 플랫폼에서 제공하는 프로필 이미지

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];

  @Column({ type: 'varchar', nullable: true, select: false })
  refreshToken: string | null;

  @ManyToMany(() => Post, (post) => post.likedUsers)
  likedPosts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable({
    name: 'user_followers_user', // 테이블 이름 명시
    joinColumn: {
      name: 'userId_1',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId_2',
      referencedColumnName: 'id',
    },
  })
  following: User[];

  @ManyToMany(() => User, (user) => user.following)
  followers: User[];
}
