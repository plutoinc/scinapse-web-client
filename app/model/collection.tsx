import { schema } from 'normalizr';
import { Member } from './member';

export interface Collection {
  id: string;
  createdBy: Member;
  title: string;
  description: string;
  paperCount: number;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  containsSelected?: boolean;
  note?: string | null;
  // used on client only
  noteUpdated?: boolean;
}

export const collectionSchema = new schema.Entity('collections');
