import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './routes/posts/posts.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { UserModule } from './routes/user/user.module';
import ConfigModule from './config';
// import { Board } from './entity/board.entity';
// import { User } from './entity/user.entity';
import { AuthModule } from './routes/auth/auth.module';
import { CommentController } from './routes/comment/comment.controller';
import { CommentModule } from './routes/comment/comment.module';
import { PostsController } from './routes/posts/posts.controller';
import { UploadModule } from './routes/upload/upload.module';

@Module({
  imports: [
    ConfigModule(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: false,
      logging: true,
    }),
    PostsModule,
    UserModule,
    AuthModule,
    CommentModule,
    UploadModule,
  ],
  controllers: [AppController, CommentController, PostsController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
