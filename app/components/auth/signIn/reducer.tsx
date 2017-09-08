import { fromJS } from "immutable";
import { ACTION_TYPES } from './actions';
import { IReduxAction } from "../../../typings/actionType";
import { IStateManager } from "../../../reducers";

type ISignInStateKeys = "meta" | "user" | "data" | "isLoading" | "hasError" | 
  "email" | "password";

export interface ISignInStateManager extends IStateManager<ISignInMetaState, ISignInDataState> {
  getIn(keyPath: ISignInStateKeys[]): any;
  setIn(keyPath: ISignInStateKeys[], value: any): ISignInStateManager;
  withMutations(mutator: (mutable: ISignInStateManager) => ISignInStateManager): ISignInStateManager;
}

interface ISignInMetaState {
  get(key: "isLoading"): boolean;
  get(key: "hasError"): boolean;

  set(key: "isLoading", value: boolean): ISignInMetaState;
  set(key: "hasError", value: boolean): ISignInMetaState;
}

interface ISignInDataState {
  get(key: "user"): any; // TODO: Change any to ISignInImmutable inteface
  set(key: "user", value: any): ISignInDataState; // TODO: Change any to ISignInImmutable inteface
}

export const SIGN_IN_INITIAL_STATE: ISignInStateManager = fromJS({
  meta: {
    isLoading: false,
    hasError: false,
  },
  data: {
    user: {
      email: '',
      password: '',
    },
  },
});

export function reducer(state = SIGN_IN_INITIAL_STATE, action: IReduxAction<any>): ISignInStateManager {
  switch (action.type) {
    case ACTION_TYPES.CHANGE_EMAIL_INPUT: {
      return state.setIn(["data", "user", "email"], action.payload.email);
    }

    case ACTION_TYPES.CHANGE_PASSWORD_INPUT: {
      return state.setIn(["data", "user", "password"], action.payload.password);
    }

    case ACTION_TYPES.START_TO_SIGN_IN: {
      return state.withMutations((currentState: ISignInStateManager) => {
        return currentState
          .setIn(["meta", "isLoading"], true)
          .setIn(["meta", "hasError"], false);
      });
    }

    case ACTION_TYPES.FAILED_TO_SIGN_IN: {
      return state.withMutations((currentState: ISignInStateManager) => {
        return currentState
          .setIn(["meta", "isLoading"], false)
          .setIn(["meta", "hasError"], true);
      });
    }

    case ACTION_TYPES.SUCCEEDED_TO_SIGN_IN: {
      return state.withMutations((currentState: ISignInStateManager) => {
        return currentState
          .setIn(["meta", "isLoading"], false)
          .setIn(["meta", "hasError"], false);
      });
    }

    default:
      return state;
  }
}
