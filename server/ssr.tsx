import * as path from "path";
import * as React from "react";
import * as express from "express";
import { Provider } from "react-redux";
import axios from "axios";
import { Helmet } from "react-helmet";
import { matchPath, StaticRouter } from "react-router-dom";
import { createMuiTheme, createGenerateClassName, MuiThemeProvider } from "@material-ui/core/styles";
import * as ReactDOMServer from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";
import StoreManager from "../app/store";
import { ConnectedRootRoutes as RootRoutes, routesMap } from "../app/routes";
import { ACTION_TYPES } from "../app/actions/actionTypes";
import CssInjector from "../app/helpers/cssInjector";
import { generateFullHTML } from "../app/helpers/htmlWrapper";
const JssProvider = require("react-jss/lib/JssProvider").default;
const { SheetsRegistry } = require("react-jss/lib/jss");

const statsFile = path.resolve(__dirname, "../client/loadable-stats.json");
const extractor = new ChunkExtractor({ statsFile, outputPath: "http://localhost:8000/client" });

const ssr = async (req: express.Request, _scriptPath: string, version: string) => {
  // override user request
  axios.defaults.headers.common = {
    ...axios.defaults.headers.common,
    "user-agent": req.headers["user-agent"] || "",
    "x-forwarded-for": req.headers["x-forwarded-for"] || "",
    referer: req.headers.referer || "",
    "x-from-ssr": true,
  };
  // Initialize and make Redux store per each request
  StoreManager.initializeStore(req.originalUrl);
  const store = StoreManager.store;

  // Load data from API server
  const promises: Array<Promise<any>> = [];
  routesMap.some(route => {
    const match = matchPath(req.path, route);
    if (match && !!route.loadData) {
      promises.push(
        route.loadData({
          dispatch: store.dispatch,
          match,
          queryParams: req.query,
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
        <StaticRouter location={req.url} context={routeContext}>
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
  const styleTags = extractor.getStyleTags();
  console.log("scriptTags === ", scriptTags);
  console.log("linkTags === ", linkTags);
  console.log("styleTags === ", styleTags);
  const materialUICss = sheetsRegistry.toString();
  const cssArr = Array.from(css);
  const helmet = Helmet.renderStatic();
  const currentState = store.getState();
  const stringifiedInitialReduxState = JSON.stringify(currentState);

  const html: string = await generateFullHTML({
    reactDom: renderedHTML,
    scriptTags,
    helmet,
    initialState: stringifiedInitialReduxState,
    css: cssArr.join("") + materialUICss,
    version,
  });

  return html;
};

export default ssr;
