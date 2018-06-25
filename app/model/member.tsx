import { IWallet } from "./wallet";
import { MemberOAuth } from "./oauth";

export interface Member {
  id: number;
  email: string;
  name: string;
  profileImage: string;
  affiliation: string;
  major: string;
  reputation: number;
  articleCount: number;
  reviewCount: number;
  commentCount: number;
  emailVerified: boolean;
  oauth: MemberOAuth | null;
  wallet?: IWallet;
}

export interface MemberWithCollection {
  id: number;
  email: string;
  emailVerified: boolean;
  name: string;
  profileImage: string;
  affiliation: string;
  major: string;
  commentCount: number;
  oauth: MemberOAuth | null;
}
