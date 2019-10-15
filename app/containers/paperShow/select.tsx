import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import { getPaperEntities } from '../../selectors/papersSelector';
import { paperSchema, Paper } from '../../model/paper';
import { AppState } from '../../reducers';

function getPaperId(state: AppState) {
  return state.paperShow.paperId;
}

export const getMemoizedPaper = createSelector([getPaperId, getPaperEntities], (paperId, paperEntities) => {
  const paper: Paper | null = denormalize(paperId, paperSchema, { papers: paperEntities });
  return paper;
});
