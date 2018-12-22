import { denormalize } from "normalizr";
import { createSelector } from "reselect";
import { getPaperEntities } from "../../selectors/papersSelector";
import { paperSchema, Paper } from "../../model/paper";
import { AppState } from "../../reducers";

function getPaperId(state: AppState) {
  return state.paperShow.paperId;
}

function getReferencePaperIds(state: AppState) {
  return state.paperShow.referencePaperIds;
}

function getCitedPaperIds(state: AppState) {
  return state.paperShow.citedPaperIds;
}

// function getMemoizedPapers(paperIds: number[], paperEntities: { [paperId: number]: Paper }) {
//   return denormalize(paperIds, [paperSchema], paperEntities);
// }

export const getMemoizedPaper = createSelector([getPaperId, getPaperEntities], (paperId, paperEntities) => {
  return denormalize(paperId, paperSchema, paperEntities);
});

export const getReferencePapers = createSelector(
  [getReferencePaperIds, getPaperEntities],
  (paperIds, paperEntities) => {
    return denormalize(paperIds, [paperSchema], paperEntities);
  }
);

export const getCitedPapers = createSelector([getCitedPaperIds, getPaperEntities], (paperIds, paperEntities) => {
  return denormalize(paperIds, [paperSchema], paperEntities);
});
