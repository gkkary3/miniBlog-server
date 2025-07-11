import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Gmail SMTP 사용
      auth: {
        user: 'nambawon1@gmail.com', // 발송자 이메일
        pass: this.configService.get<string>('EMAIL_PASSWORD'), // 앱 비밀번호
      },
    });
  }

  // 6자리 랜덤 인증번호 생성
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 인증번호 이메일 발송
  async sendVerificationEmail(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    const mailOptions = {
      from: '"Boolog" <nambawon1@gmail.com>', // Gmail 주소 사용하되 브랜드명 표시
      to: email,
      subject: '[Boolog] 이메일 인증번호',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Boolog 이메일 인증</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa; color: #212529;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- 헤더 -->
            <div style="background-color: #ffffff; padding: 40px 30px 30px 30px; text-align: center; border-bottom: 1px solid #e9ecef;">
              <h1 style="margin: 0; color: #212529; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Boolog
              </h1>
              <p style="margin: 8px 0 0 0; color: #6c757d; font-size: 14px; font-weight: 400;">
                개발자를 위한 블로그 플랫폼
              </p>
            </div>
            
            <!-- 컨텐츠 -->
            <div style="padding: 40px 30px; text-align: center;">
              <h2 style="margin: 0 0 16px 0; color: #212529; font-size: 20px; font-weight: 600;">
                이메일 인증
              </h2>
              
              <p style="margin: 0 0 32px 0; color: #495057; font-size: 15px; line-height: 1.5;">
                Boolog 회원가입을 위한 인증번호입니다.<br>
                아래 인증번호를 입력해주세요.
              </p>
              
              <!-- 인증번호 박스 -->
              <div style="background-color: #f8f9fa; border: 2px solid #dee2e6; border-radius: 8px; padding: 24px; margin: 0 auto 32px auto; max-width: 200px;">
                <div style="color: #212529; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', 'Monaco', monospace;">
                  ${verificationCode}
                </div>
              </div>
              
              <!-- 만료 안내 -->
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 16px; margin: 0 auto; max-width: 400px;">
                <p style="margin: 0; color: #856404; font-size: 13px; font-weight: 500;">
                  ⏰ 이 인증번호는 5분간 유효합니다
                </p>
              </div>
            </div>
            
            <!-- 푸터 -->
            <div style="background-color: #f8f9fa; padding: 24px 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 4px 0; color: #6c757d; font-size: 13px;">
                본 메일은 발신전용입니다.
              </p>
              <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                © 2025 Boolog. All rights reserved.
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`인증번호 이메일 발송 완료: ${email}`);
    } catch (error) {
      console.error('이메일 발송 실패:', error);
      throw new Error('이메일 발송에 실패했습니다.');
    }
  }
}
