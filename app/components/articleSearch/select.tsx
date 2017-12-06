import { createSelector } from "reselect";
import { IPapersRecord } from "../../model/paper";

const getPapers = (papers: IPapersRecord, searchItemsToShow: IPapersRecord) => {
  if (papers) {
    return papers.filter(paper => {
      return searchItemsToShow.some(targetPaper => paper.id === targetPaper.id);
    });
  }
};

const selectPapers = createSelector(getPapers, papers => {
  if (papers) {
    return papers;
  }
});

export default selectPapers;
