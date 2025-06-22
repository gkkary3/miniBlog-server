import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http.exceptions';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // CORS 설정 추가
  app.enableCors({
    origin: ['http://localhost:3000', 'https://boolog.vercel.app'], // Next.js 클라이언트 주소
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // 정적 파일 서빙 설정 추가
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const config = new DocumentBuilder()
    .setTitle('MiniBlog API Server')
    .setDescription(
      `## MiniBlog API 서버

개인 블로그 플랫폼을 위한 RESTful API 서버입니다.

### 주요 기능
- **회원가입/로그인** - JWT 기반 인증 시스템
- **게시글 관리** - 작성, 수정, 삭제, 조회
- **댓글 시스템** - 댓글 작성, 수정, 삭제
- **좋아요 기능** - 게시글 좋아요/좋아요 취소
- **카테고리** - 게시글 분류 시스템

### API 사용법

#### 1. 인증하기
1. \`POST /auth/signup\` 으로 회원가입 또는 \`POST /auth/login\` 으로 로그인
2. 응답에서 \`accessToken\` 값을 복사

#### 2. JWT 토큰 설정하기
1. Swagger 페이지 오른쪽 상단의 **"Authorize"** 버튼 클릭
2. **Value** 필드에 따옴표를 제외한 accessToken 값만 입력
3. **"Authorize"** 버튼 클릭하여 인증 완료

#### 3. API 테스트하기
1. 원하는 API의 **"Try it out"** 버튼 클릭
2. 필요한 파라미터 입력 후 **"Execute"** 실행
3. 응답 결과 확인

### 인증 정책
- **Public**: 게시글/댓글 조회, 회원가입, 로그인
- **Private**: 게시글/댓글 작성/수정/삭제, 좋아요, 프로필 조회

### 참고사항
- 토큰이 만료되면 \`POST /auth/refresh\` 로 갱신
- API 테스트 시 실제 데이터가 생성/수정/삭제됩니다
- 문제 발생 시 응답의 에러 메시지를 확인하세요`,
    )
    .setVersion('1.0')
    .addTag('auth', '🔐 인증 관련 API - 회원가입, 로그인, 프로필')
    .addTag('posts', '📝 게시글 관련 API - CRUD, 좋아요, 댓글')
    .addTag('comments', '💬 댓글 관리 API - 삭제')
    .addTag('user', '👤 사용자 관리 API - 조회, 수정, 삭제')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '로그인 후 받은 accessToken을 입력하세요 (따옴표 제외)',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
