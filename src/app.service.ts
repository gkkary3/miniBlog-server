import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MiniBlog API Server</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          }
          h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 10px;
            font-size: 2.5em;
          }
          .subtitle {
            text-align: center;
            color: #7f8c8d;
            margin-bottom: 30px;
            font-size: 1.2em;
          }
          .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .feature {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
          }
          .feature h3 {
            margin-top: 0;
            color: #2c3e50;
          }
          .api-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 30px 0;
            flex-wrap: wrap;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s ease;
          }
          .btn-primary {
            background: #3498db;
            color: white;
          }
          .btn-primary:hover {
            background: #2980b9;
            transform: translateY(-2px);
          }
          .btn-secondary {
            background: #2ecc71;
            color: white;
          }
          .btn-secondary:hover {
            background: #27ae60;
            transform: translateY(-2px);
          }
          .guide {
            background: #e8f4fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .guide h3 {
            color: #2c3e50;
            margin-top: 0;
          }
          .guide ol {
            margin: 10px 0;
          }
          .guide li {
            margin: 8px 0;
          }
          .code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #7f8c8d;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 MiniBlog API Server</h1>
          <p class="subtitle">개인 블로그 플랫폼을 위한 RESTful API 서버</p>
          
          <div class="features">
            <div class="feature">
              <h3>🔐 사용자 인증</h3>
              <p>JWT 기반 회원가입, 로그인, 토큰 갱신 시스템</p>
            </div>
            <div class="feature">
              <h3>📝 게시글 관리</h3>
              <p>CRUD 기능을 통한 완벽한 게시글 관리</p>
            </div>
            <div class="feature">
              <h3>💬 댓글 시스템</h3>
              <p>게시글별 댓글 작성, 수정, 삭제 기능</p>
            </div>
            <div class="feature">
              <h3>👍 좋아요 기능</h3>
              <p>게시글 좋아요/좋아요 취소 및 통계</p>
            </div>
            <div class="feature">
              <h3>🏷️ 카테고리</h3>
              <p>게시글 분류를 위한 카테고리 시스템</p>
            </div>
            <div class="feature">
              <h3>📊 실시간 데이터</h3>
              <p>Supabase PostgreSQL 연동으로 안정적인 데이터 관리</p>
            </div>
          </div>

          <div class="api-links">
            <a href="/api" class="btn btn-primary">📖 Swagger API 문서</a>
            <a href="/posts" class="btn btn-secondary">📝 게시글 목록 (JSON)</a>
          </div>

          <div class="guide">
            <h3>🔧 API 사용법</h3>
            <ol>
              <li><span class="code">POST /auth/signup</span> 또는 <span class="code">POST /auth/login</span>으로 인증</li>
              <li>응답에서 <span class="code">accessToken</span> 값을 복사</li>
              <li>Swagger 페이지에서 오른쪽 상단 <strong>🔓 "Authorize"</strong> 버튼 클릭</li>
              <li><strong>Value</strong> 필드에 따옴표("")를 제외한 <span class="code">accessToken</span> 값 입력</li>
              <li>이제 🔒 자물쇠 표시가 있는 인증이 필요한 API들을 사용할 수 있습니다!</li>
            </ol>
          </div>

          <div class="guide">
            <h3>🌐 인증 정책</h3>
            <p><strong>🟢 인증 불필요:</strong> 게시글/댓글 조회, 회원가입, 로그인, 토큰 갱신</p>
            <p><strong>🔒 인증 필요:</strong> 게시글/댓글 작성/수정/삭제, 좋아요, 프로필 조회</p>
          </div>

          <div class="footer">
            <p>💡 <strong>배포 환경:</strong> Render + Supabase PostgreSQL</p>
            <p>🚀 <strong>기술 스택:</strong> NestJS, TypeORM, JWT, Swagger</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
