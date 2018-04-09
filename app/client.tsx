import * as React from "react";
import * as ReactGA from "react-ga";
import * as ReactDom from "react-dom";
import { Provider, Store } from "react-redux";
import * as Raven from "raven-js";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import * as ReactRouterRedux from "react-router-redux";
import CssInjector from "./helpers/cssInjector";
import EnvChecker from "./helpers/envChecker";
import ErrorTracker from "./helpers/errorHandler";
import { ConnectedRootRoutes as RootRoutes } from "./routes";
import { checkLoggedIn } from "./components/auth/actions";
import StoreManager from "./store";
import { ACTION_TYPES } from "./actions/actionTypes";

const RAVEN_CODE = "https://d99fe92b97004e0c86095815f80469ac@sentry.io/217822";

class PlutoRenderer {
  private _store: Store<any> = StoreManager.store;

  get store() {
    return this._store;
  }

  public async renderPlutoApp() {
    this.initializeRaven();
    this.initializeGA();
    this.checkAuthStatus();
    await this.renderAfterCheckAuthStatus();
    this.checkRender();
  }

  private getMuiTheme = () => {
    return getMuiTheme({
      menuItem: {
        hoverColor: "#f5f7fb",
      },
    });
  };

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
          debug: true,
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
    this.store.dispatch({ type: ACTION_TYPES.GLOBAL_SUCCEEDED_TO_RENDER_AT_THE_CLIENT_SIDE });
  }

  private renderAfterCheckAuthStatus() {
    ReactDom.render(
      <ErrorTracker>
        <CssInjector>
          <Provider store={this.store}>
            <MuiThemeProvider muiTheme={this.getMuiTheme()}>
              <ReactRouterRedux.ConnectedRouter history={StoreManager.history}>
                <RootRoutes />
              </ReactRouterRedux.ConnectedRouter>
            </MuiThemeProvider>
          </Provider>
        </CssInjector>
      </ErrorTracker>,
      document.getElementById("react-app"),
    );
  }
}

export default PlutoRenderer;
