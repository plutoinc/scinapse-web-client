import { schema } from 'normalizr';
import { Paper } from './paper';

export interface PaperInCollection {
  note: string | null;
  collectionId: number;
  paperId: string;
  paper: Paper;
}

export const paperInCollectionSchema = new schema.Entity('papersInCollection', undefined, {
  idAttribute: value => value.paperId,
});
