import * as React from "react";
import * as URL from "url";
import { parse, stringify } from "qs";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";
import * as ReactDOMServer from "react-dom/server";
import * as ReactRouterRedux from "react-router-redux";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { matchPath } from "react-router-dom";
import { staticHTMLWrapper } from "./helpers/htmlWrapper";
import CssInjector, { css } from "./helpers/cssInjector";
import { ConnectedRootRoutes as RootRoutes, routesMap } from "./routes";
import StoreManager from "./store";
import * as fs from "fs";
import EnvChecker from "./helpers/envChecker";
import * as LambdaProxy from "./typings/lambda";
import * as DeployConfig from "../scripts/deploy/config";

export function getQueryParamsObject(queryParams: string | object) {
  if (typeof queryParams === "object") {
    return queryParams;
  } else if (typeof queryParams === "string") {
    return parse(queryParams, { ignoreQueryPrefix: true });
  } else {
    return null;
  }
}

export function getPathWithQueryParams(pathName: string, queryParams: object | null) {
  if (queryParams) {
    const stringifiedQueryParams = stringify(queryParams, { addQueryPrefix: true, allowDots: true });
    return pathName + stringifiedQueryParams;
  } else {
    return pathName;
  }
}

export async function serverSideRender(requestUrl: string, scriptPath: string, queryParamsObject?: object) {
  const promises: Array<Promise<any>> = [];
  const store = StoreManager.store;
  const url = URL.parse(requestUrl);
  const pathname = url.pathname;
  const queryParams = getQueryParamsObject(queryParamsObject || url.search);

  routesMap.some(route => {
    const match = matchPath(pathname, route);

    console.log(match, "=== MATCH");
    if (match && !!route.loadData) {
      console.log("FIRE LOAD DATA", match, queryParams);
      promises.push(route.loadData({ store, match, queryParams }));
    }
    return !!match;
  });

  await Promise.all(promises).catch(err => {
    console.error(`Fetching data error ${err}`);
  });

  store.dispatch(ReactRouterRedux.push(getPathWithQueryParams(pathname, queryParams)));

  const renderedHTML = ReactDOMServer.renderToString(
    <CssInjector>
      <Provider store={store}>
        <MuiThemeProvider>
          <ReactRouterRedux.ConnectedRouter history={StoreManager.history}>
            <RootRoutes />
          </ReactRouterRedux.ConnectedRouter>
        </MuiThemeProvider>
      </Provider>
    </CssInjector>,
  );

  const cssArr = Array.from(css);
  const helmet = Helmet.renderStatic();

  const currentState = store.getState();
  const stringifiedInitialReduxState = JSON.stringify(currentState);

  const fullHTML: string = await staticHTMLWrapper(
    renderedHTML,
    scriptPath,
    helmet,
    stringifiedInitialReduxState,
    cssArr.join(""),
  );

  return fullHTML;
}

export async function handler(event: LambdaProxy.Event, context: LambdaProxy.Context) {
  if (EnvChecker.isServer()) {
    const LAMBDA_SERVICE_NAME = "pluto-web-client";
    const path = event.path;
    const version = fs.readFileSync("./version");

    let requestPath: string;
    if (path === `/${LAMBDA_SERVICE_NAME}`) {
      requestPath = "/";
    } else {
      requestPath = path.replace(`/${LAMBDA_SERVICE_NAME}`, "");
    }

    try {
      const bundledJsForBrowserPath = `${DeployConfig.CDN_BASE_PATH}/${
        DeployConfig.AWS_S3_FOLDER_PREFIX
      }/${version}/bundleBrowser.js`;
      const response = await serverSideRender(requestPath, bundledJsForBrowserPath, event.queryStringParameters);
      context.succeed({
        statusCode: 200,
        headers: {
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
        },
        body: response,
      });
    } catch (e) {
      context.succeed({
        statusCode: 500,
        headers: {
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(e.meesage),
      });
    }
  }
}
