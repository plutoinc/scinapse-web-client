import { DialogStateRecord, DIALOG_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state = DIALOG_INITIAL_STATE, action: ReduxAction<any>): DialogStateRecord {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return state.set("isOpen", false);
    }

    case ACTION_TYPES.GLOBAL_DIALOG_OPEN: {
      return state.withMutations(currentState => {
        return currentState.set("isOpen", true).set("type", action.payload.type);
      });
    }

    case ACTION_TYPES.GLOBAL_DIALOG_CLOSE: {
      return state.set("isOpen", false);
    }

    case ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE: {
      return state.set("type", action.payload.type);
    }

    default:
      return state;
  }
}
