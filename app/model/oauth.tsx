import { OAUTH_VENDOR } from "../api/types/auth";
import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface MemberOAuth {
  connected: boolean | null;
  oauthId: string | null;
  userData: {} | null;
  uuid: string | null;
  vendor: OAUTH_VENDOR | null;
}

export const initialMemberOAuth: MemberOAuth = {
  connected: null,
  oauthId: null,
  userData: null,
  uuid: null,
  vendor: null,
};

export interface MemberOAuthRecord extends TypedRecord<MemberOAuthRecord>, MemberOAuth {}

export const MemberOAuthFactory = makeTypedFactory<MemberOAuth, MemberOAuthRecord>(initialMemberOAuth);
