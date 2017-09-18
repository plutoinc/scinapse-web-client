import { IReduxAction } from "../../typings/actionType";
import { IDialogStateRecord, DIALOG_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state = DIALOG_INITIAL_STATE, action: IReduxAction<any>): IDialogStateRecord {
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

    default:
      return state;
  }
}
