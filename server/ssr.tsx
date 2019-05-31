import * as path from 'path';
import * as React from 'react';
import { stringify } from 'qs';
import { Request } from 'express';
import { Provider } from 'react-redux';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { matchPath, StaticRouter } from 'react-router-dom';
import { createMuiTheme, createGenerateClassName, MuiThemeProvider } from '@material-ui/core/styles';
import * as ReactDOMServer from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import StoreManager from '../app/store';
import { ConnectedRootRoutes as RootRoutes, routesMap } from '../app/routes';
import { ACTION_TYPES } from '../app/actions/actionTypes';
import CssInjector from '../app/helpers/cssInjector';
import { generateFullHTML } from '../app/helpers/htmlWrapper';
const JssProvider = require('react-jss/lib/JssProvider').default;
const { SheetsRegistry } = require('react-jss/lib/jss');

const statsFile = path.resolve(__dirname, '../client/loadable-stats.json');
const extractor = new ChunkExtractor({ statsFile });

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
  const fullURL = getFullUrl(req);

  // override user request
  axios.defaults.headers.common = {
    ...axios.defaults.headers.common,
    'user-agent': req.headers['user-agent'] || '',
    'x-forwarded-for': req.headers['x-forwarded-for'] || '',
    referer: req.headers.referer || '',
    'x-from-ssr': true,
  };

  // Initialize and make Redux store per each request
  StoreManager.initializeStore(fullURL);
  const store = StoreManager.store;

  // Load data from API server
  const promises: Promise<any>[] = [];
  routesMap.some(route => {
    const match = matchPath(req.path, route);
    if (match && !!route.loadData) {
      promises.push(
        route.loadData({
          dispatch: store.dispatch,
          match,
          queryParams: getQueryParamsObject(req),
          pathname: req.path,
          cancelToken: axios.CancelToken.source().token,
        })
      );
    }
    return !!match;
  });

  await Promise.all(promises)
    .then(() => {
      store.dispatch({
        type: ACTION_TYPES.GLOBAL_SUCCEEDED_TO_INITIAL_DATA_FETCHING,
      });
    })
    .catch(err => {
      console.error(`Fetching data error at server - ${err}`);
    });

  const css = new Set();
  const context = {
    insertCss: (...styles: any[]) => styles.forEach(style => css.add(style._getCss())),
  };
  const routeContext: { statusCode?: number } = {};

  // Create Material-UI theme and sheet
  const sheetsRegistry = new SheetsRegistry();
  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
  });

  const generateClassName = createGenerateClassName();
  const jsx = extractor.collectChunks(
    <CssInjector context={context}>
      <Provider store={store}>
        <StaticRouter location={fullURL} context={routeContext}>
          <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
            <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
              <RootRoutes />
            </MuiThemeProvider>
          </JssProvider>
        </StaticRouter>
      </Provider>
    </CssInjector>
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

  return html;
};

export default ssr;
