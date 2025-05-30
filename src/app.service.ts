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
        <title>MiniBlog API</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #ffffff;
            color: #1f2937;
            line-height: 1.6;
            overflow-x: hidden;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          
          .header {
            padding: 4rem 2rem 2rem;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            position: relative;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
          }
          
          .header-content {
            position: relative;
            z-index: 1;
          }
          
          .title {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            letter-spacing: -0.025em;
          }
          
          .subtitle {
            font-size: 1.25rem;
            opacity: 0.9;
            font-weight: 400;
            margin-bottom: 2rem;
          }
          
          .version-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50px;
            font-size: 0.875rem;
            font-weight: 500;
            backdrop-filter: blur(10px);
          }
          
          .main-content {
            flex: 1;
            padding: 3rem 2rem;
          }
          
          .quick-start {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 3rem;
          }
          
          .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1f2937;
          }
          
          .api-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 2rem 0;
            flex-wrap: wrap;
          }
          
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.875rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.9rem;
            text-decoration: none;
            transition: all 0.2s ease;
            border: 1px solid transparent;
          }
          
          .btn-primary {
            background: #3b82f6;
            color: white;
          }
          
          .btn-primary:hover {
            background: #2563eb;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          }
          
          .btn-secondary {
            background: white;
            color: #374151;
            border-color: #d1d5db;
          }
          
          .btn-secondary:hover {
            background: #f9fafb;
            border-color: #9ca3af;
            transform: translateY(-1px);
          }
          
          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
          }
          
          .feature-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1.5rem;
            transition: all 0.2s ease;
          }
          
          .feature-card:hover {
            border-color: #3b82f6;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
          }
          
          .feature-title {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #1f2937;
          }
          
          .feature-description {
            color: #6b7280;
            font-size: 0.9rem;
          }
          
          .auth-required {
            color: #dc2626;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          .public-access {
            color: #059669;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          .steps {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 2rem;
            margin: 2rem 0;
          }
          
          .step-list {
            list-style: none;
            counter-reset: step;
          }
          
          .step-item {
            counter-increment: step;
            margin: 1rem 0;
            padding-left: 3rem;
            position: relative;
            font-size: 0.95rem;
            color: #4b5563;
          }
          
          .step-item::before {
            content: counter(step);
            position: absolute;
            left: 0;
            top: 0;
            width: 1.75rem;
            height: 1.75rem;
            background: #3b82f6;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 600;
          }
          
          .code {
            background: #f1f5f9;
            color: #475569;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 0.85rem;
          }
          
          .tech-stack {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
            flex-wrap: wrap;
          }
          
          .tech-item {
            padding: 0.5rem 1rem;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 0.875rem;
            color: #475569;
            font-weight: 500;
          }
          
          .footer {
            text-align: center;
            padding: 2rem;
            border-top: 1px solid #f3f4f6;
            background: #f9fafb;
            color: #6b7280;
            font-size: 0.875rem;
          }
          
          @media (max-width: 768px) {
            .header {
              padding: 2rem 1rem 1rem;
            }
            
            .title {
              font-size: 2rem;
            }
            
            .main-content {
              padding: 2rem 1rem;
            }
            
            .features-grid {
              grid-template-columns: 1fr;
            }
            
            .api-buttons {
              flex-direction: column;
              align-items: center;
            }
            
            .btn {
              width: 100%;
              max-width: 250px;
              justify-content: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header class="header">
            <div class="header-content">
              <h1 class="title">MiniBlog API</h1>
              <p class="subtitle">블로그 플랫폼을 위한 RESTful API</p>
              <span class="version-badge">v1.0</span>
            </div>
          </header>
          
          <main class="main-content">
            <section class="quick-start">
              <h2 class="section-title">빠른 시작</h2>
              <div class="api-buttons">
                <a href="/api" class="btn btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  API 문서 보기
                </a>
                <a href="/posts" class="btn btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5Z" />
                  </svg>
                  게시글 보기
                </a>
              </div>
            </section>

            <section class="features-grid">
              <div class="feature-card">
                <div class="feature-title">회원 인증</div>
                <div class="feature-description">JWT 기반 사용자 인증으로 안전한 회원가입과 로그인 제공</div>
                <div class="public-access">누구나 이용</div>
              </div>
              
              <div class="feature-card">
                <div class="feature-title">게시글 관리</div>
                <div class="feature-description">카테고리 기능과 함께 블로그 게시글 작성, 조회, 수정, 삭제</div>
                <div class="auth-required">로그인 필요</div>
              </div>
              
              <div class="feature-card">
                <div class="feature-title">댓글 시스템</div>
                <div class="feature-description">게시글에 댓글을 추가하고 관리할 수 있는 인증 기반 댓글 시스템</div>
                <div class="auth-required">로그인 필요</div>
              </div>
              
              <div class="feature-card">
                <div class="feature-title">좋아요 기능</div>
                <div class="feature-description">마음에 드는 게시글에 좋아요를 누르거나 취소할 수 있는 기능</div>
                <div class="auth-required">로그인 필요</div>
              </div>
            </section>

            <section class="steps">
              <h2 class="section-title">사용 방법</h2>
              <ol class="step-list">
                <li class="step-item">
                  <span class="code">POST /auth/signup</span> 또는 <span class="code">POST /auth/login</span>으로 회원가입 또는 로그인
                </li>
                <li class="step-item">
                  응답에서 받은 <span class="code">accessToken</span>을 복사
                </li>
                <li class="step-item">
                  <span class="code">/api</span> 페이지에서 우상단의 "Authorize" 버튼 클릭
                </li>
                <li class="step-item">
                  복사한 토큰을 붙여넣기하고 인증 완료
                </li>
                <li class="step-item">
                  이제 모든 보호된 엔드포인트에 접근 가능
                </li>
              </ol>
            </section>

            <div class="tech-stack">
              <span class="tech-item">NestJS</span>
              <span class="tech-item">TypeORM</span>
              <span class="tech-item">PostgreSQL</span>
              <span class="tech-item">JWT</span>
              <span class="tech-item">Swagger</span>
            </div>
          </main>

          <footer class="footer">
            <p>Render + Supabase로 배포</p>
          </footer>
        </div>
      </body>
      </html>
    `;
  }
}
