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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f8fafc;
            color: #334155;
            line-height: 1.6;
            padding: 40px 20px;
          }
          
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
          }
          
          .header {
            text-align: center;
            padding: 60px 40px 40px;
            border-bottom: 1px solid #f1f5f9;
          }
          
          .title {
            font-size: 2.5rem;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 12px;
          }
          
          .subtitle {
            font-size: 1.125rem;
            color: #64748b;
            margin-bottom: 16px;
          }
          
          .badge {
            display: inline-block;
            padding: 6px 12px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            color: #475569;
            font-size: 0.875rem;
            font-weight: 500;
          }
          
          .content {
            padding: 40px;
          }
          
          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1px;
            margin: 40px 0;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .feature-card {
            background: white;
            padding: 24px;
            border-right: 1px solid #e2e8f0;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .feature-card:nth-child(even) {
            background: #f8fafc;
          }
          
          .feature-card:nth-child(3n) {
            border-right: none;
          }
          
          .feature-icon {
            font-size: 1.5rem;
            margin-bottom: 12px;
            display: block;
          }
          
          .feature-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 8px;
          }
          
          .feature-description {
            color: #64748b;
            font-size: 0.9rem;
          }
          
          .action-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin: 40px 0;
            flex-wrap: wrap;
          }
          
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 500;
            font-size: 0.9rem;
            text-decoration: none;
            border: 1px solid #e2e8f0;
            transition: all 0.15s ease;
          }
          
          .btn-primary {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
          }
          
          .btn-primary:hover {
            background: #2563eb;
            border-color: #2563eb;
          }
          
          .btn-secondary {
            background: white;
            color: #374151;
          }
          
          .btn-secondary:hover {
            background: #f9fafb;
          }
          
          .guide-section {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 32px;
            margin: 40px 0;
          }
          
          .guide-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 24px;
          }
          
          .guide-steps {
            list-style: none;
          }
          
          .guide-step {
            margin: 16px 0;
            padding-left: 32px;
            position: relative;
            color: #4b5563;
            counter-increment: step;
          }
          
          .guide-steps {
            counter-reset: step;
          }
          
          .guide-step::before {
            content: counter(step);
            position: absolute;
            left: 0;
            top: 0;
            width: 20px;
            height: 20px;
            background: #3b82f6;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 600;
          }
          
          .code-snippet {
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 2px 6px;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 0.8rem;
            color: #475569;
          }
          
          .status-section {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin: 40px 0;
            flex-wrap: wrap;
          }
          
          .status-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 0.875rem;
            color: #475569;
          }
          
          .status-public {
            border-color: #10b981;
            background: #f0fdf4;
            color: #059669;
          }
          
          .status-auth {
            border-color: #f59e0b;
            background: #fffbeb;
            color: #d97706;
          }
          
          .footer {
            text-align: center;
            padding: 40px;
            border-top: 1px solid #f1f5f9;
            background: #f8fafc;
          }
          
          .tech-stack {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin: 16px 0;
            flex-wrap: wrap;
          }
          
          .tech-item {
            padding: 4px 8px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            font-size: 0.75rem;
            color: #64748b;
          }
          
          .footer-text {
            color: #94a3b8;
            font-size: 0.875rem;
            margin: 8px 0;
          }
          
          @media (max-width: 768px) {
            body {
              padding: 20px 16px;
            }
            
            .title {
              font-size: 2rem;
            }
            
            .header {
              padding: 40px 24px 24px;
            }
            
            .content {
              padding: 24px;
            }
            
            .features-grid {
              grid-template-columns: 1fr;
            }
            
            .feature-card {
              border-right: none;
            }
            
            .action-buttons {
              flex-direction: column;
              align-items: center;
            }
            
            .btn {
              width: 100%;
              max-width: 200px;
              justify-content: center;
            }
            
            .guide-section {
              padding: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">MiniBlog API</h1>
            <p class="subtitle">나만의 블로그를 만들어보세요! 🎨</p>
            <span class="badge">✨ 완전 무료</span>
          </div>
          
          <div class="content">
            <div class="features-grid">
              <div class="feature-card">
                <span class="feature-icon">👤</span>
                <h3 class="feature-title">회원가입 & 로그인</h3>
                <p class="feature-description">간단한 이메일로 가입하고, 안전하게 로그인할 수 있어요. 토큰 기반이라 보안도 든든!</p>
              </div>
              
              <div class="feature-card">
                <span class="feature-icon">✍️</span>
                <h3 class="feature-title">글 쓰기 & 수정</h3>
                <p class="feature-description">마음껏 글을 쓰고, 언제든지 수정하거나 삭제할 수 있어요. 내 글은 내가 관리!</p>
              </div>
              
              <div class="feature-card">
                <span class="feature-icon">💬</span>
                <h3 class="feature-title">댓글 달기</h3>
                <p class="feature-description">재미있는 글에는 댓글을 남겨보세요. 다른 사람들과 소통하는 재미가 쏠쏠!</p>
              </div>
              
              <div class="feature-card">
                <span class="feature-icon">❤️</span>
                <h3 class="feature-title">좋아요 누르기</h3>
                <p class="feature-description">마음에 드는 글에는 좋아요를 눌러주세요. 작성자가 기뻐할 거예요!</p>
              </div>
              
              <div class="feature-card">
                <span class="feature-icon">📁</span>
                <h3 class="feature-title">카테고리 분류</h3>
                <p class="feature-description">요리, 여행, 일상 등... 원하는 카테고리로 글을 깔끔하게 정리해보세요!</p>
              </div>
              
              <div class="feature-card">
                <span class="feature-icon">📖</span>
                <h3 class="feature-title">다른 사람 글 구경하기</h3>
                <p class="feature-description">다른 사람들이 올린 재미있는 글들을 마음껏 읽어보세요. 새로운 이야기가 가득!</p>
              </div>
            </div>

            <div class="action-buttons">
              <a href="/api" class="btn btn-primary">
                📖 API 사용법 보기
              </a>
              <a href="/posts" class="btn btn-secondary">
                📝 어떤 글들이 있나?
              </a>
            </div>

            <div class="guide-section">
              <h3 class="guide-title">🚀 5분만에 시작하기</h3>
              <div class="guide-steps">
                <div class="guide-step">
                  <span class="code-snippet">POST /auth/signup</span> 또는 <span class="code-snippet">POST /auth/login</span>으로 가입/로그인
                </div>
                <div class="guide-step">
                  받은 <span class="code-snippet">accessToken</span>을 복사해두세요
                </div>
                <div class="guide-step">
                  Swagger 페이지에서 우상단 <strong>🔓 "Authorize"</strong> 클릭
                </div>
                <div class="guide-step">
                  토큰을 붙여넣기 하고 인증 완료!
                </div>
                <div class="guide-step">
                  이제 글쓰기, 댓글, 좋아요 모든 기능 사용 가능! 🎉
                </div>
              </div>
            </div>

            <div class="status-section">
              <div class="status-item status-public">
                <span>🟢</span>
                누구나 볼 수 있어요
              </div>
              <div class="status-item status-auth">
                <span>🔒</span>
                로그인이 필요해요
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="tech-stack">
              <span class="tech-item">NestJS</span>
              <span class="tech-item">TypeORM</span>
              <span class="tech-item">PostgreSQL</span>
              <span class="tech-item">JWT</span>
              <span class="tech-item">Swagger</span>
              <span class="tech-item">Supabase</span>
            </div>
            <p class="footer-text">💡 개발자를 위한 완전 무료 블로그 API</p>
            <p class="footer-text">🌐 Render + Supabase로 안정적으로 호스팅</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
