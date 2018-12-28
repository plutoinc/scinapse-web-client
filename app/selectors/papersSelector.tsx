import { denormalize } from "normalizr";
import { AppState } from "../reducers";
import { Paper, paperSchema } from "../model/paper";

export function getDenormalizedPapers(paperIds: number[], paperEntities: { [paperId: number]: Paper }) {
  return denormalize(paperIds, [paperSchema], paperEntities);
}

export function getPaperEntities(state: AppState) {
  return { papers: state.entities.papers };
}
