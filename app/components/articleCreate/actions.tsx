import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_CREATE_STEP } from "./records";

export function changeCreateStep(step: ARTICLE_CREATE_STEP) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_CREATE_STEP,
    payload: {
      step,
    },
  };
}
