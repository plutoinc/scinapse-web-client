import { Middleware } from "redux";
import * as toastr from "toastr";
import { ACTION_TYPES } from "../actions/actionTypes";

const ReduxNotifier: Middleware = _store => next => (action: any) => {
  if (action.type === ACTION_TYPES.GLOBAL_LOCATION_CHANGE) {
    toastr.success("We do have the Kapua suite available.", "Turtle Bay Resort", { timeOut: 5000 });
  } else {
    return next(action);
  }
};

export default ReduxNotifier;
