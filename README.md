# MiniBlog API Server

개인 블로그 플랫폼을 위한 RESTful API 서버입니다.

## 🔗 Demo

- **홈페이지**: [https://miniblog-server.onrender.com/](https://miniblog-server.onrender.com/)
- **API 문서**: [https://miniblog-server.onrender.com/api](https://miniblog-server.onrender.com/api)
- **게시글 API**: [https://miniblog-server.onrender.com/posts](https://miniblog-server.onrender.com/posts)

## 기능

| 기능 | 설명 | 인증 필요 |
|------|------|-----------|
| 회원가입/로그인 | JWT 기반 인증 | ❌ |
| 게시글 CRUD | 글 작성, 수정, 삭제 | ✅ |
| 댓글 시스템 | 게시글 댓글 관리 | ✅ |
| 좋아요 | 게시글 좋아요/취소 | ✅ |
| 카테고리 | 글 분류 시스템 | ✅ |
| 게시글 조회 | 모든 사용자 글 조회 | ❌ |

## 기술 스택

**Backend**
- NestJS, TypeORM, JWT, Passport, Swagger

**Database**
- PostgreSQL (Supabase)

**Deploy**
- Render

## 데이터베이스 구조

```
User
├─ id, username, email, password
└─ 관계: posts[], likedPosts[], comments[]

Post  
├─ id, title, content, userId, username
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

# 마이그레이션 실행
npm run migration:run

# 개발 서버 실행
npm run start:dev
```

## API 사용법

### 인증
```bash
POST /auth/signup    # 회원가입
POST /auth/login     # 로그인
```

### 게시글
```bash
GET /posts                      # 전체 게시글 (공개)
GET /posts/@userId/:id          # 게시글 상세 (공개)
POST /posts/@userId/write       # 게시글 작성 (인증 필요)
PUT /posts/@userId/:id          # 게시글 수정 (인증 필요)
DELETE /posts/@userId/:id       # 게시글 삭제 (인증 필요)
```

### 댓글/좋아요
```bash
GET /posts/@userId/:id/comments    # 댓글 조회 (공개)
POST /posts/@userId/:id/comments   # 댓글 작성 (인증 필요)
POST /posts/@userId/:id/like       # 좋아요 (인증 필요)
DELETE /posts/@userId/:id/like     # 좋아요 취소 (인증 필요)
```

**Swagger 인증 설정**
1. `/api`에서 우상단 "Authorize" 클릭
2. 로그인 후 받은 `accessToken` 입력
3. 인증이 필요한 API 사용 가능

## 프로젝트 구조

```
src/
├── routes/
│   ├── auth/         # 인증
│   ├── posts/        # 게시글
│   ├── comments/     # 댓글
│   └── user/         # 사용자
├── entity/           # DB 엔티티
├── database/         # 마이그레이션
└── exceptions/       # 예외 처리
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

- JWT 토큰 기반 인증/인가
- TypeORM 마이그레이션 관리
- Swagger API 문서 자동 생성
- PostgreSQL 연동
- 실제 배포 환경 구성
