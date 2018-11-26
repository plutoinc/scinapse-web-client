import { normalize } from "normalizr";
import { Dispatch } from "react-redux";
import { ActionCreators } from "./actionTypes";
import AuthorAPI, { ConnectAuthorParams } from "../api/author";
import { Paper, paperSchema } from "../model/paper";
import PlutoAxios from "../api/pluto";
import alertToast from "../helpers/makePlutoToastAction";

export function updateAuthor(params: ConnectAuthorParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToUpdateProfileData());

    const authorResponse = await AuthorAPI.updateAuthor(params);

    dispatch(ActionCreators.addEntity(authorResponse));
    dispatch(ActionCreators.succeededToUpdateProfileData());
  };
}

export function succeedToUpdateAuthorSelectedPaperList(params: { authorId: number; papers: Paper[] }) {
  return ActionCreators.succeedToUpdateAuthorSelectedPapers(params);
}

export function addPaperToAuthorPaperList(authorId: number, papers: Paper[]) {
  return async (dispatch: Dispatch<any>) => {
    const paperIds = papers.map(paper => paper.id);
    dispatch(ActionCreators.startToAddPaperToAuthorPaperList());

    await AuthorAPI.addPapersToAuthorPaperList(authorId, paperIds);

    // HACK: you should normalize papers in API level
    const normalizedPapers = normalize(papers, [paperSchema]);
    dispatch(ActionCreators.addEntity(normalizedPapers));
    dispatch(ActionCreators.succeededToAddPaperToAuthorPaperList({ paperIds, authorId }));
  };
}

export function removePaperFromPaperList(authorId: number, paper: Paper) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToRemovePaperFromAuthorPaperList());

    try {
      await AuthorAPI.removeAuthorPapers(authorId, [paper.id]);
      dispatch(ActionCreators.succeededToRemovePaperFromAuthorPaperList({ paperId: paper.id, authorId }));
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      alertToast({
        type: "error",
        message: "Had an error to remove publication",
      });
    }
  };
}
