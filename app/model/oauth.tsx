import { OAUTH_VENDOR } from "../api/types/auth";

export interface MemberOAuth {
  connected: boolean;
  oauthId: string;
  userData: {};
  uuid: string;
  vendor: OAUTH_VENDOR | null;
}
