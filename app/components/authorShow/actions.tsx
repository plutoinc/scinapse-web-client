import { Dispatch } from "react-redux";
import AuthorAPI from "../../api/author";
import alertToast from "../../helpers/makePlutoToastAction";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function getCoAuthors(authorId: number) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const coAuthors = await AuthorAPI.getCoAuthors(authorId);

      dispatch({
        type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_CO_AUTHORS,
        payload: {
          coAuthors,
        },
      });
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
      const author = await AuthorAPI.getAuthor(authorId);

      dispatch({
        type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_AUTHOR,
        payload: {
          author,
        },
      });
    } catch (err) {
      console.error(err); // TODO: Remove console
      alertToast({
        type: "error",
        message: "Failed to get author information",
      });
    }
  };
}
