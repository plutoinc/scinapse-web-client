import { LayoutState, LAYOUT_INITIAL_STATE, UserDevice } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state: LayoutState = LAYOUT_INITIAL_STATE, action: ReduxAction<any>): LayoutState {
  switch (action.type) {
    case ACTION_TYPES.SET_DEVICE_TO_DESKTOP: {
      return { ...state, userDevice: UserDevice.DESKTOP };
    }

    case ACTION_TYPES.SET_DEVICE_TO_TABLET: {
      return { ...state, userDevice: UserDevice.TABLET };
    }

    case ACTION_TYPES.SET_DEVICE_TO_MOBILE: {
      return { ...state, userDevice: UserDevice.MOBILE };
    }

    default:
      return state;
  }
}
