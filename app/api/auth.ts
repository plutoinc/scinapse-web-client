import PlutoAxios from './pluto';
import { Member } from '../model/member';
import {
  SignInWithEmailParams,
  SignInResult,
  SignInData,
  VerifyEmailResult,
  CheckDuplicatedEmailResult,
  OAUTH_VENDOR,
  OAuthCheckResult,
  ChangePasswordParams,
  EmailSettingsResponse,
  UpdateEmailSettingParams,
  UpdateUserInformationAPIParams,
  SignUpWithEmailParams,
  SignUpWithSocialParams,
} from './types/auth';

class AuthAPI extends PlutoAxios {
  public async signUpWithEmail(params: SignUpWithEmailParams): Promise<Member> {
    const signUpWithEmailResponse = await this.post('/members', {
      email: params.email,
      password: params.password,
      first_name: params.firstName,
      last_name: params.lastName,
      affiliation_id: String(params.affiliationId),
      affiliation_name: params.affiliation,
      profile_link: params.profileLink || null,
    });

    const member = signUpWithEmailResponse.data;

    return {
      ...member,
      authorId: String(member.authorId),
    };
  }

  public async signUpWithSocial(params: SignUpWithSocialParams): Promise<Member> {
    const signUpWithSocialResponse = await this.post('/members/oauth', {
      email: params.email,
      token: params.token,
      first_name: params.firstName,
      last_name: params.lastName,
      affiliation_id: String(params.affiliationId),
      affiliation_name: params.affiliation,
      profile_link: params.profileLink || null,
    });

    const member = signUpWithSocialResponse.data;

    return {
      ...member,
      authorId: String(member.authorId),
    };
  }

  public async signInWithEmail(userInfo: SignInWithEmailParams): Promise<SignInResult> {
    const signInWithEmailResponse = await this.post('/auth/login', {
      email: userInfo.email,
      password: userInfo.password,
    });
    const signInData: SignInData = signInWithEmailResponse.data;

    return {
      ...signInData,
      member: {
        ...signInData.member,
        authorId: String(signInData.member.authorId),
      },
    };
  }

  public async signOut() {
    await this.post('auth/logout');
  }

  public async checkDuplicatedEmail(email: string): Promise<CheckDuplicatedEmailResult> {
    const checkDuplicatedEmailResponse = await this.get('/members/checkDuplication', {
      params: {
        email,
      },
    });

    return checkDuplicatedEmailResponse.data;
  }

  public async checkLoggedIn(): Promise<SignInResult> {
    const checkLoggedInResponse = await this.get('/auth/login');
    const checkLoggedInData: SignInData = checkLoggedInResponse.data;

    const signInData: SignInData = checkLoggedInData;

    return {
      ...signInData,
      member: {
        ...signInData.member,
        authorId: String(signInData.member.authorId),
      },
    };
  }

  public async verifyToken(token: string): Promise<VerifyEmailResult> {
    const verifyTokenResponse = await this.post('/email-verification', {
      token,
    });

    return verifyTokenResponse.data;
  }

  public async resendVerificationEmail(email: string): Promise<VerifyEmailResult> {
    const resendVerificationEmailResponse = await this.post('/email-verification/resend', {
      email,
    });

    return resendVerificationEmailResponse.data;
  }

  public async requestResetPasswordToken(email: string): Promise<{ success: boolean }> {
    const response = await this.post('/members/password-token', email);

    return response.data;
  }

  public async resetPassword(password: string, token: string): Promise<{ success: boolean }> {
    const response = await this.post('/members/reset-password', {
      password,
      token,
    });

    return response.data;
  }

  public async checkOAuthStatus(vendor: OAUTH_VENDOR, token: string): Promise<OAuthCheckResult> {
    const res = await this.post('/auth/oauth/check', { vendor, token });

    return res.data.data.content;
  }

  public async loginWithOAuth(vendor: OAUTH_VENDOR, token: string): Promise<SignInResult> {
    const res = await this.post('/auth/oauth/login', { vendor, token });
    const signInData: SignInData = res.data;

    return {
      ...signInData,
      member: {
        ...signInData.member,
        authorId: String(signInData.member.authorId),
      },
    };
  }

  public async update(params: UpdateUserInformationAPIParams): Promise<Member> {
    const res = await this.put('/members/me', params);
    const member = res.data;

    return {
      ...member,
      authorId: String(member.authorId),
    };
  }

  public async changePassword({ oldPassword, newPassword }: ChangePasswordParams) {
    await this.put('/members/me/password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }

  public async getEmailSettings(token?: string): Promise<EmailSettingsResponse> {
    const res = await this.get(`/notifications/email/settings?token=${token}`);
    return res.data;
  }

  public async updateEmailSetting({
    token,
    type,
    setting,
  }: UpdateEmailSettingParams): Promise<{
    success: boolean;
  }> {
    const res = await this.put(`/notifications/email/settings?token=${token}`, {
      type,
      setting: setting ? 'ON' : 'OFF',
    });
    return res.data.data.content;
  }
}

const apiHelper = new AuthAPI();

export default apiHelper;
