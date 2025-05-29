# 📝 MiniBlog API Server

> **나만의 블로그를 만들어보세요!** 개인 블로그 플랫폼을 위한 완전한 RESTful API 서버

## 🌐 Live Demo

- **🏠 홈페이지**: [https://miniblog-server.onrender.com/](https://miniblog-server.onrender.com/)
- **📖 API 문서**: [https://miniblog-server.onrender.com/api](https://miniblog-server.onrender.com/api)
- **📝 게시글 목록**: [https://miniblog-server.onrender.com/posts](https://miniblog-server.onrender.com/posts)

## ✨ 주요 기능

| 기능 | 설명 | 인증 필요 |
|------|------|-----------|
| 👤 **회원가입 & 로그인** | JWT 기반 인증 시스템 | ❌ |
| ✍️ **글 쓰기 & 수정** | 게시글 CRUD 기능 | ✅ |
| 💬 **댓글 달기** | 실시간 댓글 시스템 | ✅ |
| ❤️ **좋아요 누르기** | 게시글 좋아요/취소 | ✅ |
| 📁 **카테고리 분류** | 유연한 태그 시스템 | ✅ |
| 📖 **다른 사람 글 구경** | 모든 게시글 조회 | ❌ |

## 🛠️ 기술 스택

### **Backend**
- **NestJS** - Node.js 프레임워크
- **TypeORM** - ORM
- **JWT** - 인증/인가
- **Passport** - 인증 미들웨어
- **Swagger** - API 문서화

### **Database**
- **PostgreSQL** - 메인 데이터베이스
- **Supabase** - 클라우드 PostgreSQL 호스팅

### **DevOps & Deployment**
- **Render** - 서버 배포
- **GitHub** - 소스 코드 관리
- **TypeScript** - 타입 안정성

## 📊 데이터베이스 설계

```
📦 ERD 구조
┣ 👤 User (사용자)
┃  ┣ id, username, email, password
┃  ┣ createdAt, updatedAt
┃  ┗ 관계: posts[], likedPosts[], comments[]
┃
┣ 📝 Post (게시글)  
┃  ┣ id, title, content, userId, username
┃  ┣ createdAt, updatedAt
┃  ┗ 관계: user, comments[], likedUsers[], categories[]
┃
┣ 💬 Comment (댓글)
┃  ┣ id, content, userId, postId
┃  ┣ createdAt, updatedAt
┃  ┗ 관계: user, post
┃
┗ 🏷️ Category (카테고리)
   ┣ id, name
   ┣ createdAt, updatedAt
   ┗ 관계: posts[]
```

## 🚀 빠른 시작

### 1️⃣ 설치
```bash
git clone https://github.com/your-username/MiniBlog.git
cd MiniBlog
npm install
```

### 2️⃣ 환경변수 설정
```bash
# .env 파일 생성
DATABASE_URL=postgresql://username:password@host:port/database
DIRECT_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-jwt-secret-key
PORT=3000
```

### 3️⃣ 데이터베이스 마이그레이션
```bash
npm run migration:run
```

### 4️⃣ 개발 서버 실행
```bash
npm run start:dev
```

## 📖 API 사용법

### 🔐 인증이 필요한 API 사용하기

1. **회원가입/로그인**
   ```bash
   POST /auth/signup
   POST /auth/login
   ```

2. **토큰 설정**
   - Swagger UI에서 우상단 🔓 **"Authorize"** 클릭
   - 받은 `accessToken` 값 입력 (따옴표 제외)

3. **API 사용**
   ```bash
   POST /posts/@userId/write        # 글 작성
   PUT /posts/@userId/:id           # 글 수정  
   DELETE /posts/@userId/:id        # 글 삭제
   POST /posts/@userId/:id/like     # 좋아요
   ```

### 🌐 공개 API (인증 불필요)

```bash
GET /posts                    # 전체 게시글 조회
GET /posts/@userId/:id        # 게시글 상세 조회
GET /posts/@userId/:id/comments # 댓글 조회
```

## 📁 프로젝트 구조

```
src/
┣ 📂 routes/
┃  ┣ 🔐 auth/         # 인증 관련
┃  ┣ 📝 posts/        # 게시글 관련  
┃  ┣ 💬 comments/     # 댓글 관리
┃  ┗ 👤 user/         # 사용자 관리
┣ 📂 entity/          # 데이터베이스 엔티티
┣ 📂 database/        # 마이그레이션 & 설정
┗ 📂 exceptions/      # 예외 처리
```

## 🎯 주요 특징

- **✅ 완전한 JWT 인증 시스템**
- **✅ TypeORM 마이그레이션 관리**  
- **✅ Swagger 자동 문서화**
- **✅ 실시간 배포 (Render + Supabase)**
- **✅ TypeScript 타입 안정성**
- **✅ RESTful API 설계**

## 🔧 주요 명령어

```bash
# 개발
npm run start:dev          # 개발 서버 실행
npm run build              # 프로덕션 빌드

# 데이터베이스
npm run migration:generate # 마이그레이션 생성
npm run migration:run      # 마이그레이션 실행

# 코드 품질
npm run lint               # ESLint 실행
npm run format             # Prettier 포맷팅
```

## 🌟 핵심 성과

- **🚀 실제 배포 완료** - Render + Supabase 클라우드 배포
- **📊 완전한 ERD 설계** - User, Post, Comment, Category 관계 설정
- **🔒 보안 강화** - JWT + bcrypt 패스워드 암호화
- **📖 완벽한 문서화** - Swagger UI로 모든 API 문서 제공
- **🎨 모던 UI** - 심플하고 직관적인 홈페이지

## 📞 연락처

- **GitHub**: [프로젝트 링크]
- **이메일**: [your-email@example.com]
- **포트폴리오**: [your-portfolio-link]

---

> 💡 **이 프로젝트는 현대적인 웹 개발 기술스택을 활용한 실무 수준의 블로그 API 서버입니다.**
