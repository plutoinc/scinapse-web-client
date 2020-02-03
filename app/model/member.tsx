import { schema } from 'normalizr';
import { MemberOAuth } from './oauth';

export interface Member {
  id: number;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  profileId: string | null;
  profileImageUrl: string;
  affiliationId: string | null;
  affiliationName: string | null;
  oauth: MemberOAuth | null;
  isAuthorConnected: boolean;
  authorId: string;
  profileLink: string;
}

export const memberSchema = new schema.Entity('members');
