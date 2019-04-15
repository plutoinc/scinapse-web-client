import { BrowserRouter } from "react-router-dom";
import { loadableReady } from "@loadable/component";
import "intersection-observer";
import * as React from "react";
import * as ReactGA from "react-ga";
import * as ReactDom from "react-dom";
import { Provider, Store } from "react-redux";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssInjector from "./helpers/cssInjector";
import EnvChecker from "./helpers/envChecker";
import ErrorTracker from "./helpers/errorHandler";
import { ConnectedRootRoutes as RootRoutes } from "./routes";
import StoreManager from "./store";
import { ACTION_TYPES } from "./actions/actionTypes";
import { AppState } from "./reducers";
import "./helpers/rafPolyfill";
import { checkAuthStatus } from "./components/auth/actions";
const { pdfjs } = require("react-pdf");
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
declare var Sentry: any;

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
    this.renderAtClient();
  }

  private initSentry() {
    if (EnvChecker.isProdBrowser()) {
      Sentry.init({
        dsn: "https://90218bd0404f4e8e97fbb17279974c23@sentry.io/1306012",
      });
    }
  }

  private initializeGA() {
    if (EnvChecker.isProdBrowser() && !EnvChecker.isBot()) {
      ReactGA.initialize("UA-109822865-1");

      ReactGA.set({
        page: window.location.pathname + window.location.search,
      });

      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }

  private checkRender() {
    this.store.dispatch({
      type: ACTION_TYPES.GLOBAL_SUCCEEDED_TO_RENDER_AT_THE_CLIENT_SIDE,
    });
  }

  private checkAuthStatus() {
    this.store.dispatch(checkAuthStatus());
  }

  private renderAtClient() {
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

    loadableReady(() => {
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
        document.getElementById("react-app"),
        () => {
          this.checkRender();
          this.checkAuthStatus();
        }
      );
    });
  }
}

export default PlutoRenderer;
