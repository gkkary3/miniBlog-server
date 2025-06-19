import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

interface KakaoProfile {
  id: string;
  username: string;
  _json: {
    kakao_account?: {
      email?: string;
    };
    properties?: {
      nickname?: string;
      profile_image?: string;
    };
  };
}

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
      callbackURL:
        process.env.KAKAO_CALLBACK_URL ||
        'http://localhost:4000/auth/kakao/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: KakaoProfile,
    done: (error: any, user?: any) => void,
  ): Promise<any> {
    const { username, _json } = profile;
    const user = {
      email: _json.kakao_account?.email || `${profile.id}@kakao.com`,
      username:
        username || _json.properties?.nickname || `KakaoUser${profile.id}`,
      provider: 'kakao',
      providerId: profile.id.toString(),
      profileImage: _json.properties?.profile_image || undefined,
    };

    // AuthService에서 소셜 로그인 처리
    const result = await this.authService.handleSocialLogin(user);
    done(null, result);
  }
}
