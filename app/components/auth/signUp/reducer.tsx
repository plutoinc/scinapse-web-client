import { fromJS } from "immutable";
import { ACTION_TYPES } from './actions';
import { IReduxAction } from "../../../typings/actionType";
import { IStateManager } from "../../../reducers";

type ISignUpStateKeys = "meta" | "user" | "data" | "isLoading" | "hasError" | 
  "email" | "password" | "repeatPassword" | "fullName";

export interface ISignUpStateManager extends IStateManager<ISignUpMetaState, ISignUpDataState> {
  getIn(keyPath: ISignUpStateKeys[]): any;
  setIn(keyPath: ISignUpStateKeys[], value: any): ISignUpStateManager;
  withMutations(mutator: (mutable: ISignUpStateManager) => ISignUpStateManager): ISignUpStateManager;
}

interface ISignUpMetaState {
  get(key: "isLoading"): boolean;
  get(key: "hasError"): boolean;

  set(key: "isLoading", value: boolean): ISignUpMetaState;
  set(key: "hasError", value: boolean): ISignUpMetaState;
}

interface ISignUpDataState {
  get(key: "user"): any; // TODO: Change any to ISignUpImmutable inteface
  set(key: "user", value: any): ISignUpDataState; // TODO: Change any to ISignUpImmutable inteface
}

export const SIGN_UP_INITIAL_STATE: ISignUpStateManager = fromJS({
  meta: {
    isLoading: false,
    hasError: false,
  },
  data: {
    user: {
      email: '',
      password: '',
      repeatPassword: '',
      fullName: '',
    },
  },
});

export function reducer(state = SIGN_UP_INITIAL_STATE, action: IReduxAction<any>): ISignUpStateManager {
  switch (action.type) {
    case ACTION_TYPES.CHANGE_EMAIL_INPUT: {
      return state.setIn(["data", "user", "email"], action.payload.email);
    }

    case ACTION_TYPES.CHANGE_PASSWORD_INPUT: {
      return state.setIn(["data", "user", "password"], action.payload.password);
    }

    case ACTION_TYPES.CHANGE_REPEAT_PASSWORD_INPUT: {
      return state.setIn(["data", "user", "repeatPassword"], action.payload.password);
    }

    case ACTION_TYPES.CHANGE_FULL_NAME_INPUT: {
      return state.setIn(["data", "user", "fullName"], action.payload.fullName);
    }

    case ACTION_TYPES.START_TO_CREATE_ACCOUNT: {
      return state.withMutations((currentState: ISignUpStateManager) => {
        return currentState
          .setIn(["meta", "isLoading"], true)
          .setIn(["meta", "hasError"], false);
      });
    }

    case ACTION_TYPES.FAILED_TO_CREATE_ACCOUNT: {
      return state.withMutations((currentState: ISignUpStateManager) => {
        return currentState
          .setIn(["meta", "isLoading"], false)
          .setIn(["meta", "hasError"], true);
      });
    }

    case ACTION_TYPES.SUCCEEDED_TO_CREATE_ACCOUNT: {
      return state.withMutations((currentState: ISignUpStateManager) => {
        return currentState
          .setIn(["meta", "isLoading"], false)
          .setIn(["meta", "hasError"], false);
      });
    }

    default:
      return state;
  }
}
