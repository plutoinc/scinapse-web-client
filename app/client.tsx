import 'intersection-observer';
import { BrowserRouter } from 'react-router-dom';
import * as raf from 'raf';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import * as ReactDom from 'react-dom';
import { Store, AnyAction } from 'redux';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssInjector from './helpers/cssInjector';
import EnvChecker from './helpers/envChecker';
import ErrorTracker from './helpers/errorHandler';
import { ConnectedRootRoutes as RootRoutes } from './routes';
import StoreManager from './store/store';
import { ACTION_TYPES } from './actions/actionTypes';
import { AppState } from './reducers';
import { checkAuthStatus } from './components/auth/actions';
import { getCurrentPageType } from './components/locationListener';
import { ThunkDispatch } from 'redux-thunk';
import { getGAId, getOptimizeId } from './helpers/handleGA';
declare var Sentry: any;
declare var FB: any;

interface LoadScriptOptions {
  src: string;
  crossOrigin?: string;
  onLoad?: () => void;
}

function loadScript(options: LoadScriptOptions) {
  const script = document.createElement('script');
  script.src = options.src;
  if (options.crossOrigin) {
    script.crossOrigin = options.crossOrigin;
  }
  if (options.onLoad) {
    script.onload = options.onLoad;
  }
  document.body.appendChild(script);
}

class Main extends React.Component {
  public componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.crossOrigin = 'anonymous';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css';
    head.appendChild(link);
  }

  public render() {
    return <RootRoutes />;
  }
}

class PlutoRenderer {
  private _store: Store<AppState, AnyAction> & {
    dispatch: ThunkDispatch<AppState, undefined, AnyAction>;
  };

  public constructor() {
    this._store = StoreManager.store;
  }

  public get store() {
    return this._store;
  }

  public async renderPlutoApp() {
    const WebFont = await import('webfontloader');
    WebFont.load({
      custom: {
        families: ['Roboto'],
        urls: ['https://assets.pluto.network/font/roboto-self.css'],
      },
    });

    raf.polyfill();

    loadScript({ src: 'https://connect.facebook.net/en_US/sdk.js' });
    loadScript({ src: 'https://apis.google.com/js/platform.js' });
    loadScript({
      src: 'https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.js',
      crossOrigin: 'anonymous',
    });
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId: '149975229038179',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.11',
      });
    };

    if (EnvChecker.isProdBrowser()) {
      loadScript({ src: 'https://www.googletagmanager.com/gtag/js?id=AW-817738370' });
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push('js', new Date());
      (window as any).dataLayer.push('config', 'AW-817738370');
    }

    this.initializeGA();
    await this.initSentry();
    this.renderAtClient();
  }

  private async initSentry() {
    if (EnvChecker.isProdBrowser()) {
      await new Promise(resolve => {
        const script = document.createElement('script');
        script.src = 'https://browser.sentry-cdn.com/5.0.6/bundle.min.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.onload = () => {
          Sentry.init({
            dsn: 'https://90218bd0404f4e8e97fbb17279974c23@sentry.io/1306012',
            release: (window as any)._script_version_ ? (window as any)._script_version_.version : 'undefined',
          });
          resolve();
        };
        document.body.appendChild(script);
      });
    }
  }

  private initializeGA() {
    if (!EnvChecker.isBot()) {
      ReactGA.initialize(getGAId());

      const optimizeId = getOptimizeId();
      if (optimizeId) {
        ReactGA.ga()('require', optimizeId);
      }

      ReactGA.set({
        page: window.location.pathname + window.location.search,
      });
      ReactGA.pageview(window.location.pathname + window.location.search);
      if (typeof (window as any).__performance__track__list !== 'undefined') {
        (window as any).__performance__track__list.forEach((perfObj: any) => {
          ReactGA.ga()('send', 'event', perfObj);
        });
      }
    }
  }

  private checkRender() {
    this.store.dispatch({
      type: ACTION_TYPES.GLOBAL_SUCCEEDED_TO_RENDER_AT_THE_CLIENT_SIDE,
      payload: {
        initialPageType: getCurrentPageType(),
      },
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

    const App = (
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
      </CssInjector>
    );

    ReactDom.hydrate(App, document.getElementById('react-app'), () => {
      this.checkRender();
      this.checkAuthStatus();
    });
  }
}

export default PlutoRenderer;
