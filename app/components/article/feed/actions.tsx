import { ACTION_TYPES } from "../../../actions/actionTypes";

export function toggleModal() {
  return {
    type: ACTION_TYPES.ARTICLE_FEED_TOGGLE_MODAL
  };
}
