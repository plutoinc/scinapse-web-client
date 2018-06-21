import * as React from "react";
import * as ReactGA from "react-ga";
import * as ReactDom from "react-dom";
import { Provider, Store } from "react-redux";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import * as Raven from "raven-js";
import { ConnectedRouter } from "connected-react-router";
import CssInjector from "./helpers/cssInjector";
import EnvChecker from "./helpers/envChecker";
import ErrorTracker from "./helpers/errorHandler";
import { ConnectedRootRoutes as RootRoutes } from "./routes";
import { checkLoggedIn } from "./components/auth/actions";
import StoreManager from "./store";
import { ACTION_TYPES } from "./actions/actionTypes";
import { AppState } from "./reducers";

const RAVEN_CODE = "https://d99fe92b97004e0c86095815f80469ac@sentry.io/217822";

class Main extends React.Component {
  public componentDidMount() {
    const jssStyles = document.getElementById("jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  public render() {
    return <RootRoutes />;
  }
}

class PlutoRenderer {
  private _store: Store<AppState>;

  constructor() {
    StoreManager.initializeStore();
    this._store = StoreManager.store;
  }

  get store() {
    return this._store;
  }

  public async renderPlutoApp() {
    this.initializeRaven();
    this.initializeGA();
    await this.checkAuthStatus();
    this.renderAfterCheckAuthStatus();
    this.checkRender();
  }

  private initializeRaven() {
    if (!EnvChecker.isDev() && !EnvChecker.isStage()) {
      Raven.config(RAVEN_CODE).install();
    }
  }

  private initializeGA() {
    if (!EnvChecker.isServer() && !EnvChecker.isBot()) {
      let reactGATraceCode;
      if (EnvChecker.isStage()) {
        reactGATraceCode = "UA-109822865-2";
        ReactGA.initialize(reactGATraceCode, {
          debug: true
        });
      } else {
        reactGATraceCode = "UA-109822865-1";
        ReactGA.initialize(reactGATraceCode);
      }

      ReactGA.set({ page: window.location.pathname + window.location.search });
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }

  private async checkAuthStatus() {
    await this.store.dispatch(checkLoggedIn());
  }

  private checkRender() {
    this.store.dispatch({
      type: ACTION_TYPES.GLOBAL_SUCCEEDED_TO_RENDER_AT_THE_CLIENT_SIDE
    });
  }

  private renderAfterCheckAuthStatus() {
    const theme = createMuiTheme();

    ReactDom.hydrate(
      <ErrorTracker>
        <CssInjector>
          <Provider store={this.store}>
            <ConnectedRouter history={StoreManager.history}>
              <MuiThemeProvider theme={theme}>
                <Main />
              </MuiThemeProvider>
            </ConnectedRouter>
          </Provider>
        </CssInjector>
      </ErrorTracker>,
      document.getElementById("react-app")
    );
  }
}

export default PlutoRenderer;
