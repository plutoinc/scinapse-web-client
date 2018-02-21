import { IReduxAction } from "../../typings/actionType";
import { LayoutStateRecord, LAYOUT_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state = LAYOUT_INITIAL_STATE, action: IReduxAction<any>): LayoutStateRecord {
  switch (action.type) {
    case ACTION_TYPES.HEADER_REACH_SCROLL_TOP: {
      return state.set("isTop", true);
    }

    case ACTION_TYPES.HEADER_LEAVE_SCROLL_TOP: {
      return state.set("isTop", false);
    }

    case ACTION_TYPES.SET_DEVICE_TO_DESKTOP: {
      return state.set("isMobile", false);
    }

    case ACTION_TYPES.SET_DEVICE_TO_MOBILE: {
      return state.set("isMobile", true);
    }

    default:
      return state;
  }
}
