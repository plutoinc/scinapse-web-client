import { IReduxAction } from "../../../typings/actionType";
import { IEmailVerificationStateRecord, EMAIL_VERIFICATION_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../../actions/actionTypes";

export function reducer(
  state = EMAIL_VERIFICATION_INITIAL_STATE,
  action: IReduxAction<any>,
): IEmailVerificationStateRecord {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN_GO_BACK: {
      return EMAIL_VERIFICATION_INITIAL_STATE;
    }

    default:
      return state;
  }
}
