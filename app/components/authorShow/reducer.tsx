import { IReduxAction } from "../../typings/actionType";
import { AUTHOR_SHOW_INITIAL_STATE, AuthorShowStateRecord } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state = AUTHOR_SHOW_INITIAL_STATE, action: IReduxAction<any>): AuthorShowStateRecord {
  switch (action.type) {
    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_AUTHOR: {
      return state.set("author", action.payload.author);
    }

    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_CO_AUTHORS: {
      return state.set("coAuthors", action.payload.coAuthors);
    }

    default:
      return state;
  }
}
