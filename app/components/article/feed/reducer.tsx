import { IReduxAction } from "../../../typings/actionType";
import { IArticleFeedStateRecord, ARTICLE_FEED_INITIAL_STATE } from "./records";

export function reducer(state = ARTICLE_FEED_INITIAL_STATE, action: IReduxAction<any>): IArticleFeedStateRecord {
  switch (action.type) {
    default:
      return state;
  }
}
