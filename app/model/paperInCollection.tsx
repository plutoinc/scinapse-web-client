import { schema } from "normalizr";
import { Paper } from "./paper";

export interface PaperInCollection {
  note: string | null;
  collection_id: number;
  paper_id: number;
  paper: Paper;
}

export const paperInCollectionSchema = new schema.Entity("papersInCollection", undefined, {
  idAttribute: value => value.paper_id,
});
