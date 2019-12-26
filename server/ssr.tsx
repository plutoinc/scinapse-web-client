import * as path from 'path';
import * as React from 'react';
import { stringify } from 'qs';
import { Request } from 'express';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { UAParser } from 'ua-parser-js';
import { matchPath, StaticRouter } from 'react-router-dom';
import { createMuiTheme, createGenerateClassName, MuiThemeProvider } from '@material-ui/core/styles';
import * as ReactDOMServer from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import StoreManager from '../app/store/serverStore';
import { ConnectedRootRoutes as RootRoutes, routesMap } from '../app/routes';
import { ACTION_TYPES } from '../app/actions/actionTypes';
import { generateFullHTML } from '../app/helpers/htmlWrapper';
import PlutoAxios from '../app/api/pluto';
import { setDeviceType, UserDevice } from '../app/components/layouts/reducer';
import { parse } from 'cookie';
import { SignInResult } from '../app/api/types/auth';
import { getAxiosInstance } from '../app/api/axios';
const StyleContext = require('isomorphic-style-loader/StyleContext');
const JssProvider = require('react-jss/lib/JssProvider').default;
const { SheetsRegistry } = require('react-jss/lib/jss');
const statsFile = path.resolve(__dirname, '../client/loadable-stats.json');

function isExpressRequest(req: Request | LambdaProxy.Event): req is Request {
  return !!(req as Request).originalUrl;
}

function getFullUrl(req: Request | LambdaProxy.Event) {
  if (isExpressRequest(req)) {
    return req.originalUrl;
  }

  if (!req.queryStringParameters) {
    return req.path;
  }

  return req.path + stringify(req.queryStringParameters, { addQueryPrefix: true, encode: false });
}

function getQueryParamsObject(req: Request | LambdaProxy.Event): { [key: string]: string } {
  if (isExpressRequest(req)) {
    return req.query;
  }

  return req.queryStringParameters || {};
}

const ssr = async (req: Request | LambdaProxy.Event, version: string) => {
  const extractor = new ChunkExtractor({ statsFile });
  const fullURL = getFullUrl(req);

  const headers: { [key: string]: string | undefined } = {};
  for (const key of Object.keys(req.headers)) {
    const newKey = key.toLowerCase();
    if (newKey) {
      headers[newKey] = req.headers[key] as string;
    }
  }

  const axios = getAxiosInstance({
    headers: {
      cookie: headers.cookie,
      'user-agent': headers['user-agent'] || '',
      'x-forwarded-for': headers['x-forwarded-for'] || '',
      referer: headers.referer || '',
      'x-from-ssr': true,
    },
  });

  // Initialize and make Redux store per each request
  const store = StoreManager.getStore({ axios });

  const userAgent = headers['user-agent'];
  const device = new UAParser(userAgent).getDevice();
  if (device && device.type === 'mobile') {
    store.dispatch(setDeviceType({ userDevice: UserDevice.MOBILE }));
  }

  // Get the latest JWT
  const cookies = parse(headers.cookie || '');
  let setCookies: string[] = [];
  if (cookies['pluto_jwt']) {
    try {
      const res = await axios.get('/auth/login');
      const signInResult: SignInResult = res.data;

      if (signInResult.loggedIn) {
        setCookies = res.headers['set-cookie'];
        store.dispatch({
          type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
          payload: {
            user: signInResult.member,
            loggedIn: signInResult.loggedIn,
            oauthLoggedIn: signInResult.oauthLoggedIn,
          },
        });
      }
    } catch (err) {
      console.log('Failed to get logged in user when even token existed: ', err);
    }
  }

  // Load data from API server
  const promises: Promise<any>[] = [];
  try {
    routesMap.some(route => {
      const match = matchPath(req.path, route);
      if (!!match && !!route.loadData) {
        promises.push(
          route.loadData({
            dispatch: store.dispatch,
            match,
            queryParams: getQueryParamsObject(req),
            pathname: req.path,
          })
        );
      }
      return !!match;
    });
  } catch (_err) {}

  await Promise.all(promises)
    .then(() => {
      store.dispatch({
        type: ACTION_TYPES.GLOBAL_SUCCEEDED_TO_INITIAL_DATA_FETCHING,
      });
    })
    .catch(err => {
      console.trace(err);
      const error = PlutoAxios.getGlobalError(err);
      console.error(`Fetching data error at server - ${error.message}`);
    });

  const css = new Set();
  const routeContext: { statusCode?: number } = {};
  const insertCss = (...styles: any[]) => styles.forEach(style => css.add(style._getCss()));

  // Create Material-UI theme and sheet
  const sheetsRegistry = new SheetsRegistry();
  const sheetsManager = new Map();
  const generateClassName = createGenerateClassName();
  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
  });

  const jsx = extractor.collectChunks(
    <StyleContext.Provider value={{ insertCss }}>
      <Provider store={store}>
        <StaticRouter location={fullURL} context={routeContext}>
          <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
            <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
              <RootRoutes />
            </MuiThemeProvider>
          </JssProvider>
        </StaticRouter>
      </Provider>
    </StyleContext.Provider>
  );

  const renderedHTML = ReactDOMServer.renderToString(jsx);
  const scriptTags = extractor.getScriptTags();
  const linkTags = extractor.getLinkTags();
  // const styleTags = extractor.getStyleTags();
  const materialUICss = sheetsRegistry.toString();
  const cssArr = Array.from(css);
  const helmet = Helmet.renderStatic();
  const currentState = store.getState();
  const stringifiedInitialReduxState = JSON.stringify(currentState);

  const html: string = await generateFullHTML({
    reactDom: renderedHTML,
    linkTags,
    scriptTags,
    helmet,
    initialState: stringifiedInitialReduxState,
    css: cssArr.join('') + materialUICss,
    version,
  });

  return {
    html,
    setCookies,
  };
};

export default ssr;
