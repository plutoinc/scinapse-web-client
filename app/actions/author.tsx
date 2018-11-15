import { Dispatch } from "react-redux";
import { ActionCreators } from "./actionTypes";
import AuthorAPI, { UpdateAuthorParams } from "../api/author";

export function updateAuthor(params: UpdateAuthorParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToUpdateProfileData());

    const authorResponse = await AuthorAPI.updateAuthor(params);

    dispatch(ActionCreators.addEntity(authorResponse));
    dispatch(ActionCreators.succeededToUpdateProfileData());
  };
}
