import * as Immutable from "immutable";
import * as React from "react";
import * as ReactDom from "react-dom";
import { applyMiddleware, createStore } from "redux";
import { History, createBrowserHistory, createHashHistory } from "history";
import { Provider } from "react-redux";
import * as Raven from "raven-js";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as ReactRouterRedux from "react-router-redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import EnvChecker from "./helpers/envChecker";
import ErrorTracker from "./helpers/errorHandler";
import { rootReducer, initialState } from "./reducers";
import routes from "./routes";
import ReduxNotifier from "./helpers/notifier";
import { checkLoggedIn } from "./components/auth/actions";
import * as ReactGA from "react-ga";

const reactCookie = require("react-cookie");

const RAVEN_CODE = "https://d99fe92b97004e0c86095815f80469ac@sentry.io/217822";

let history: History;
if (EnvChecker.isDev()) {
  history = createHashHistory();
} else {
  history = createBrowserHistory();
}

const routerMid = ReactRouterRedux.routerMiddleware(history);

const logger = createLogger({
  stateTransformer: state => {
    const newState: any = {};
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

export const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(routerMid, thunkMiddleware, ReduxNotifier, logger),
);

if (!EnvChecker.isDev() && !EnvChecker.isStage()) {
  Raven.config(RAVEN_CODE).install();
}

ReactDom.render(<div>LoggedIn Check....</div>, document.getElementById("react-app"));

// initialize GA
if (!EnvChecker.isDev()) {
  ReactGA.initialize("UA-109822865-1");
  ReactGA.set({ page: window.location.pathname + window.location.search });
}

(async () => {
  await store.dispatch(checkLoggedIn());

  ReactDom.render(
    <ErrorTracker>
      <Provider store={store}>
        <reactCookie.CookiesProvider>
          <MuiThemeProvider>
            <ReactRouterRedux.ConnectedRouter history={history}>{routes}</ReactRouterRedux.ConnectedRouter>,
          </MuiThemeProvider>
        </reactCookie.CookiesProvider>
      </Provider>
    </ErrorTracker>,
    document.getElementById("react-app"),
  );
})();
