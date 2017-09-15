import { IReduxAction } from "../../../typings/actionType";
import { IArticleFeedStateRecord, ARTICLE_FEED_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../../actions/actionTypes";

export function reducer(
  state = ARTICLE_FEED_INITIAL_STATE,
  action: IReduxAction<any>
): IArticleFeedStateRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_FEED_TOGGLE_MODAL: {
      return state.set("isModalOpen", !state.get("isModalOpen"));
    }

    default:
      return state;
  }
}
