import { schema } from 'normalizr';
import { MemberOAuth } from './oauth';

export interface Member {
  id: number;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  affiliation: string;
  oauth: MemberOAuth | null;
  isAuthorConnected: boolean;
  authorId: number;
  profileLink: string;
}

export const memberSchema = new schema.Entity('members');
