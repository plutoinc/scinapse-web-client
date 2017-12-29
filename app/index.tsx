import * as Immutable from "immutable";
import * as React from "react";
import * as ReactGA from "react-ga";
import * as ReactDom from "react-dom";
import { Store, applyMiddleware, createStore } from "redux";
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

const RAVEN_CODE = "https://d99fe92b97004e0c86095815f80469ac@sentry.io/217822";

class PlutoRenderer {
  private store: Store<any>;
  private history: History;

  private routerMiddleware = ReactRouterRedux.routerMiddleware(this.getHistoryObject());

  private loggerMiddleware = createLogger({
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

  private getHistoryFromEnvironment() {
    if (EnvChecker.isDev()) {
      return createHashHistory();
    } else {
      return createBrowserHistory();
    }
  }

  private getHistoryObject() {
    if (this.history) {
      return this.history;
    } else {
      this.history = this.getHistoryFromEnvironment();
      return this.history;
    }
  }

  private initializeRaven() {
    if (!EnvChecker.isDev() && !EnvChecker.isStage()) {
      Raven.config(RAVEN_CODE).install();
    }
  }

  private initializeGA() {
    if (!EnvChecker.isDev()) {
      ReactGA.initialize("UA-109822865-1");
      ReactGA.set({ page: window.location.pathname + window.location.search });
    }
  }

  private renderBeforeCheckAuthStatus() {
    ReactDom.render(<div>LoggedIn Check....</div>, document.getElementById("react-app"));
  }

  private async checkAuthStatus() {
    await this.getStore().dispatch(checkLoggedIn());
  }

  private renderAfterCheckAuthStatus() {
    ReactDom.render(
      <ErrorTracker>
        <Provider store={this.getStore()}>
          <MuiThemeProvider>
            <ReactRouterRedux.ConnectedRouter history={this.getHistoryObject()}>
              {routes}
            </ReactRouterRedux.ConnectedRouter>,
          </MuiThemeProvider>
        </Provider>
      </ErrorTracker>,
      document.getElementById("react-app"),
    );
  }

  public getStore() {
    if (this.store) {
      return this.store;
    } else {
      if (EnvChecker.isDev() || EnvChecker.isStage()) {
        this.store = createStore(
          rootReducer,
          initialState,
          applyMiddleware(this.routerMiddleware, thunkMiddleware, ReduxNotifier, this.loggerMiddleware),
        );
      } else {
        this.store = createStore(rootReducer, initialState, applyMiddleware(this.routerMiddleware, thunkMiddleware));
      }
      return this.store;
    }
  }

  public async renderPlutoApp() {
    this.initializeRaven();
    this.initializeGA();
    this.renderBeforeCheckAuthStatus();
    await this.checkAuthStatus();
    this.renderAfterCheckAuthStatus();
  }
}

const plutoRenderer = new PlutoRenderer();

plutoRenderer.renderPlutoApp();

export default plutoRenderer;
