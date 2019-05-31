import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { paperSchema } from '../model/paper';

export function getPaperEntities(state: AppState) {
  return state.entities.papers;
}

// function getRelatedPaperIds(state: AppState) {
//   return state.relatedPapersState.paperIds;
// }

export const makeGetMemoizedPapers = (getPaperIds: () => number[]) => {
  return createSelector([getPaperIds, getPaperEntities], (paperIds, paperEntities) => {
    return denormalize(paperIds, [paperSchema], { papers: paperEntities });
  });
};
