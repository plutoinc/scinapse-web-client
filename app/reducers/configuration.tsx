import { ACTION_TYPES } from "../actions/actionTypes";

export interface Configuration
  extends Readonly<{
      initialFetched: boolean;
      clientJSRendered: boolean;
    }> {}

export const CONFIGURATION_INITIAL_STATE: Configuration = {
  initialFetched: false,
  clientJSRendered: false,
};

export function reducer(state: Configuration = CONFIGURATION_INITIAL_STATE, action: ReduxAction<any>): Configuration {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_INITIAL_DATA_FETCHING: {
      return { ...state, initialFetched: true };
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_RENDER_AT_THE_CLIENT_SIDE: {
      return { ...state, clientJSRendered: true };
    }

    default:
      return state;
  }
}
