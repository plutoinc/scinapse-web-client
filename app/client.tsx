import { BrowserRouter } from "react-router-dom";
import "intersection-observer";
import * as React from "react";
import * as ReactGA from "react-ga";
import * as ReactDom from "react-dom";
import { Provider, Store } from "react-redux";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import * as Sentry from "@sentry/browser";
import CssInjector from "./helpers/cssInjector";
import EnvChecker from "./helpers/envChecker";
import ErrorTracker from "./helpers/errorHandler";
import { ConnectedRootRoutes as RootRoutes } from "./routes";
import { checkAuthStatus } from "./components/auth/actions";
import StoreManager from "./store";
import { ACTION_TYPES } from "./actions/actionTypes";
import { AppState } from "./reducers";
const { pdfjs } = require("react-pdf");
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
    this.initializeGA();
    this.initSentry();
    this.checkAuthStatus();
    this.renderAfterCheckAuthStatus();
    this.checkRender();
  }

  private initSentry() {
    if (EnvChecker.isProdBrowser()) {
      Sentry.init({
        dsn: "https://90218bd0404f4e8e97fbb17279974c23@sentry.io/1306012",
      });
    }
  }

  private initializeGA() {
    if (!EnvChecker.isOnServer() && !EnvChecker.isBot()) {
      let reactGATraceCode;
      if (EnvChecker.isDev()) {
        reactGATraceCode = "UA-109822865-2";
        ReactGA.initialize(reactGATraceCode, {
          debug: true,
        });
      } else if (EnvChecker.isProdBrowser()) {
        reactGATraceCode = "UA-109822865-1";
        ReactGA.initialize(reactGATraceCode);
      }

      ReactGA.set({ page: window.location.pathname + window.location.search });
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }

  private checkAuthStatus() {
    this.store.dispatch(checkAuthStatus());
  }

  private checkRender() {
    this.store.dispatch({
      type: ACTION_TYPES.GLOBAL_SUCCEEDED_TO_RENDER_AT_THE_CLIENT_SIDE,
    });
  }

  private renderAfterCheckAuthStatus() {
    const theme = createMuiTheme({
      typography: {
        useNextVariants: true,
      },
    });

    const context = {
      insertCss: (...styles: any[]) => {
        const removeCss = styles.map(x => x._insertCss());
        return () => {
          removeCss.forEach(f => f());
        };
      },
    };

    ReactDom.hydrate(
      <CssInjector context={context}>
        <ErrorTracker>
          <Provider store={this.store}>
            <BrowserRouter>
              <MuiThemeProvider theme={theme}>
                <Main />
              </MuiThemeProvider>
            </BrowserRouter>
          </Provider>
        </ErrorTracker>
      </CssInjector>,
      document.getElementById("react-app")
    );
  }
}

export default PlutoRenderer;
