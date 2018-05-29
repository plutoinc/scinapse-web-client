import { Dispatch } from "react-redux";
import AuthorAPI from "../../api/author";
import alertToast from "../../helpers/makePlutoToastAction";
import { ActionCreators } from "../../actions/actionTypes";
import { GetAuthorPapersParams } from "../../api/author/types";

export function getCoAuthors(authorId: number) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const coAuthorsResponse = await AuthorAPI.getCoAuthors(authorId);

      dispatch(ActionCreators.addEntity(coAuthorsResponse));
      dispatch(ActionCreators.getCoAuthors({ coAuthorIds: coAuthorsResponse.result }));
    } catch (err) {
      alertToast({
        type: "error",
        message: "Failed to get co-authors information",
      });
    }
  };
}

export function getAuthor(authorId: number) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const authorResponse = await AuthorAPI.getAuthor(authorId);

      dispatch(ActionCreators.addEntity(authorResponse));
      dispatch(ActionCreators.getAuthor({ authorId: authorResponse.result }));
    } catch (err) {
      alertToast({
        type: "error",
        message: "Failed to get author information",
      });
    }
  };
}

export function getAuthorPapers(params: GetAuthorPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const paperResponse = await AuthorAPI.getAuthorPapers(params);
      dispatch(ActionCreators.addEntity(paperResponse));
      dispatch(
        ActionCreators.getAuthorPapers({
          paperIds: paperResponse.result,
          size: paperResponse.size,
          number: paperResponse.number,
          sort: params.sort, // Important
          first: paperResponse.first,
          last: paperResponse.last,
          numberOfElements: paperResponse.numberOfElements,
          totalPages: paperResponse.totalPages,
          totalElements: paperResponse.totalElements,
        }),
      );
    } catch (err) {
      alertToast({
        type: "error",
        message: "Failed to get author's papers information",
      });
    }
  };
}
