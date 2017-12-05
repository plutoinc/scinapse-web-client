import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { PAPER_INITIAL_STATE, IPapersRecord } from "../model/paper";

export function reducer(state = PAPER_INITIAL_STATE, action: IReduxAction<any>): IPapersRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS: {
      const targetPapers: IPapersRecord = action.payload.papers;
      const updatedPapersIdArray: number[] = [];

      const updatedPapersList = state.map(paper => {
        const alreadyExistPaper = targetPapers.find(targetPaper => {
          return targetPaper.id === paper.id;
        });

        if (alreadyExistPaper !== undefined) {
          updatedPapersIdArray.push(alreadyExistPaper.id);
          return alreadyExistPaper;
        } else {
          return paper;
        }
      });

      const targetPapersWithoutUpdatedPapers = targetPapers.filter(paper => {
        return !updatedPapersIdArray.includes(paper.id);
      });

      return updatedPapersList.concat(targetPapersWithoutUpdatedPapers).toList();
    }

    default:
      return state;
  }
}
