import { Dispatch } from "react-redux";
import AuthorAPI from "../../api/author";
import alertToast from "../../helpers/makePlutoToastAction";
import { ActionCreators } from "../../actions/actionTypes";

export function getCoAuthors(authorId: number) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const coAuthorsResponse = await AuthorAPI.getCoAuthors(authorId);

      dispatch(ActionCreators.addEntity(coAuthorsResponse));
    } catch (err) {
      console.error(err); // TODO: Remove console
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
    } catch (err) {
      console.error(err); // TODO: Remove console
      alertToast({
        type: "error",
        message: "Failed to get author information",
      });
    }
  };
}
