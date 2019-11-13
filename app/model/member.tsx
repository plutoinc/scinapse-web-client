import { schema } from 'normalizr';
import { MemberOAuth } from './oauth';

export interface Member {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  affiliation: string;
  oauth: MemberOAuth | null;
  isAuthorConnected: boolean;
  authorId: string;
  profileLink: string;
}

export const memberSchema = new schema.Entity('members');
