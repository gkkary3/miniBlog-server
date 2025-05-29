import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http.exceptions';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const config = new DocumentBuilder()
    .setTitle('MiniBlog API Server')
    .setDescription(
      `## MiniBlog API 서버

**개인 블로그 플랫폼을 위한 RESTful API 서버입니다.**

### 🚀 주요 기능
- 👤 **회원가입/로그인** - JWT 기반 인증
- 📝 **게시글 CRUD** - 작성, 수정, 삭제, 조회
- 💬 **댓글 시스템** - 댓글 작성, 수정, 삭제
- 👍 **좋아요 기능** - 게시글 좋아요/좋아요 취소
- 🏷️ **카테고리** - 게시글 분류 시스템

### 📖 API 사용법

#### 1️⃣ **로그인하기**
1. **POST /auth/signup** 으로 회원가입 또는
2. **POST /auth/login** 으로 로그인
3. 응답에서 **accessToken** 값을 복사

#### 2️⃣ **JWT 토큰 설정하기**
1. Swagger 페이지 **오른쪽 상단**의 🔓 **"Authorize"** 버튼 클릭
2. **Value** 필드에 따옴표("")를 제외한 **accessToken 값만** 입력
3. **"Authorize"** 버튼 클릭
4. 이제 🔒 자물쇠 표시가 있는 API들을 사용할 수 있습니다!

#### 3️⃣ **API 테스트하기**
1. 원하는 API의 **"Try it out"** 버튼 클릭
2. 필요한 파라미터 입력
3. **"Execute"** 버튼 클릭
4. 응답 결과 확인

### 🔐 인증 정책
- 🟢 **인증 불필요**: 게시글/댓글 조회, 회원가입, 로그인
- 🔒 **인증 필요**: 게시글/댓글 작성/수정/삭제, 좋아요, 프로필 조회

### 💡 팁
- 토큰이 만료되면 **POST /auth/refresh** 로 갱신하세요
- API 테스트 시 실제 데이터가 생성/수정/삭제됩니다
- 문제가 있으면 응답의 에러 메시지를 확인하세요`,
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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
