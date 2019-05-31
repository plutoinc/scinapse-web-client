import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import { getPaperEntities } from '../../selectors/papersSelector';
import { paperSchema } from '../../model/paper';
import { AppState } from '../../reducers';

function getPaperId(state: AppState) {
  return state.paperShow.paperId;
}

export const getMemoizedPaper = createSelector([getPaperId, getPaperEntities], (paperId, paperEntities) => {
  return denormalize(paperId, paperSchema, { papers: paperEntities });
});
