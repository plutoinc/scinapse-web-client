import { OAUTH_VENDOR } from "../api/types/auth";
import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IMemberOAuth {
  connected: boolean | null;
  oauthId: string | null;
  userData: {} | null;
  uuid: string | null;
  vendor: OAUTH_VENDOR | null;
}

export const initialMemberOAuth: IMemberOAuth = {
  connected: null,
  oauthId: null,
  userData: null,
  uuid: null,
  vendor: null,
};

export interface IMemberOAuthRecord extends TypedRecord<IMemberOAuthRecord>, IMemberOAuth {}

export const MemberOAuthFactory = makeTypedFactory<IMemberOAuth, IMemberOAuthRecord>(initialMemberOAuth);
