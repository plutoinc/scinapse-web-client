import * as Immutable from "immutable";
import * as React from "react";
import * as ReactDom from "react-dom";
import { applyMiddleware, createStore } from "redux";
import { History, createBrowserHistory, createHashHistory } from "history";
import { Provider } from "react-redux";
// // redux middlewares
import * as ReactRouterRedux from "react-router-redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import EnvChecker from "./helpers/envChecker";
import { rootReducer, initialState } from "./reducers";
import routes from "./routes";

let history: History;
if (EnvChecker.isDev()) {
  history = createHashHistory();
} else {
  history = createBrowserHistory();
}

const routerMid = ReactRouterRedux.routerMiddleware(history);

// Set logger middleware to convert from ImmutableJS to plainJS
const logger = createLogger({
  stateTransformer: state => {
    const newState: any = {}; // HACK: Should assign proper type later
    for (const i of Object.keys(state)) {
      if ((Immutable as any).Iterable.isIterable(state[i])) {
        newState[i] = state[i].toJS();
      } else {
        newState[i] = state[i];
      }
    }
    return newState;
  },
});

const store = createStore(rootReducer, initialState, applyMiddleware(routerMid, thunkMiddleware, logger));

ReactDom.render(
  <Provider store={store}>
    <ReactRouterRedux.ConnectedRouter history={history}>{routes}</ReactRouterRedux.ConnectedRouter>
  </Provider>,
  document.getElementById("react-app"),
);
