# MiniBlog API Server

개인 블로그 플랫폼을 위한 RESTful API 서버입니다.

## 🔗 Demo

- **홈페이지**: [https://miniblog-server.onrender.com/](https://miniblog-server.onrender.com/)
- **API 문서**: [https://miniblog-server.onrender.com/api](https://miniblog-server.onrender.com/api)

## 기능

| 기능            | 설명                    | 인증 필요 |
| --------------- | ----------------------- | --------- |
| 회원가입/로그인 | JWT 기반 인증           | ❌        |
| 소셜 로그인     | Google, Kakao OAuth     | ❌        |
| 토큰 갱신       | Refresh Token 기반      | ❌        |
| 게시글 CRUD     | 글 작성, 수정, 삭제     | ✅        |
| 게시글 검색     | 제목, 내용, 작성자 검색 | ❌        |
| 댓글 시스템     | 게시글 댓글 관리        | ✅        |
| 좋아요          | 게시글 좋아요/취소      | ✅        |
| 카테고리        | 글 분류 시스템          | ✅        |
| 이미지 업로드   | 게시글 이미지 첨부      | ✅        |
| 사용자 팔로우   | 팔로우/언팔로우         | ✅        |
| 게시글 조회     | 모든 사용자 글 조회     | ❌        |

## 기술 스택

**Backend**

- NestJS, TypeORM, JWT, Passport, Swagger, Multer

**Database**

- PostgreSQL (Supabase)

**Deploy**

- Render

## 데이터베이스 구조

```
User
├─ id, username, email, password, userId
├─ provider, providerId, profileImage (소셜 로그인)
├─ refreshToken
└─ 관계: posts[], likedPosts[], comments[], following[], followers[]

Post
├─ id, title, content, userId, username
├─ images[] (이미지 URL 배열)
└─ 관계: user, comments[], likedUsers[], categories[]

Comment
├─ id, content, userId, postId
└─ 관계: user, post

Category
├─ id, name
└─ 관계: posts[]
```

## 설치 및 실행

```bash
# 클론 및 의존성 설치
git clone <repository-url>
cd MiniBlog
npm install

# 환경변수 설정 (.env)
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
JWT_SECRET=your_jwt_secret

# 소셜 로그인 설정
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_google_callback_url

KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret
KAKAO_CALLBACK_URL=your_kakao_callback_url

CLIENT_URL=your_frontend_url

# 마이그레이션 실행
npm run migration:run

# 개발 서버 실행
npm run start:dev
```

## API 사용법

### 인증

```bash
POST /auth/signup           # 회원가입
POST /auth/login            # 로그인
POST /auth/logout           # 로그아웃 (인증 필요)
POST /auth/refresh          # 토큰 갱신
GET  /auth/me               # 현재 사용자 정보 (인증 필요)

# 소셜 로그인
GET  /auth/google           # Google 로그인 시작
GET  /auth/google/callback  # Google 로그인 콜백
GET  /auth/kakao            # Kakao 로그인 시작
GET  /auth/kakao/callback   # Kakao 로그인 콜백
POST /auth/social-signup    # 소셜 회원가입 완료
```

### 게시글

```bash
GET    /posts                      # 게시글 검색 (공개)
GET    /posts/@userId              # 특정 사용자 게시글 (공개)
GET    /posts/@userId/:id          # 게시글 상세 (공개)
POST   /posts/@userId/write        # 게시글 작성 (인증 필요)
PUT    /posts/@userId/:id          # 게시글 수정 (인증 필요)
DELETE /posts/@userId/:id          # 게시글 삭제 (인증 필요)
```

### 댓글/좋아요

```bash
GET    /posts/@userId/:id/comments    # 댓글 조회 (공개)
POST   /posts/@userId/:id/comments    # 댓글 작성 (인증 필요)
GET    /posts/@userId/:id/likes       # 좋아요 조회 (인증 필요)
POST   /posts/@userId/:id/like        # 좋아요 (인증 필요)
DELETE /posts/@userId/:id/like        # 좋아요 취소 (인증 필요)
```

### 사용자 관리

```bash
GET    /user                        # 전체 사용자 조회 (공개)
GET    /user/:id                    # 특정 사용자 조회 (인증 필요)
PUT    /user/:id                    # 사용자 정보 수정 (인증 필요)
POST   /user/@userId/follow         # 사용자 팔로우 (인증 필요)
DELETE /user/@userId/follow         # 사용자 언팔로우 (인증 필요)
GET    /user/@userId/followers      # 팔로워 목록 (공개)
GET    /user/@userId/following      # 팔로잉 목록 (공개)
GET    /user/@userId/follow-status  # 팔로우 상태 확인 (공개)
```

### 파일 업로드

```bash
POST /upload/image    # 이미지 업로드 (인증 필요, 최대 5MB)
```

**게시글 검색 옵션**

```bash
GET /posts?search=검색어&page=1&limit=10&sortBy=latest
```

- `search`: 제목, 내용, 카테고리, 작성자, 작성자ID 통합 검색
- `sortBy`: `latest` (최신순), `likes` (좋아요순), `comments` (댓글순)

**Swagger 인증 설정**

1. `/api`에서 우상단 "Authorize" 클릭
2. 로그인 후 받은 `accessToken` 입력
3. 인증이 필요한 API 사용 가능

## 프로젝트 구조

```
src/
├── routes/
│   ├── auth/         # 인증 (소셜 로그인 포함)
│   ├── posts/        # 게시글 (검색 기능 포함)
│   ├── comment/      # 댓글
│   ├── user/         # 사용자 (팔로우 기능 포함)
│   └── upload/       # 파일 업로드
├── entity/           # DB 엔티티
├── database/         # 마이그레이션
├── decorators/       # 커스텀 데코레이터
├── exceptions/       # 예외 처리
└── middleware/       # 미들웨어
```

## 주요 명령어

```bash
npm run start:dev             # 개발 서버
npm run build                 # 빌드
npm run migration:generate    # 마이그레이션 생성
npm run migration:run         # 마이그레이션 실행
npm run lint                  # 린트
```

## 특징

- JWT 토큰 기반 인증/인가 (Access Token + Refresh Token)
- Google, Kakao 소셜 로그인 지원
- TypeORM 마이그레이션 관리
- Swagger API 문서 자동 생성
- PostgreSQL 연동
- 이미지 업로드 기능 (Multer)
- 사용자 팔로우 시스템
- 게시글 검색 및 정렬 기능
- 실제 배포 환경 구성
