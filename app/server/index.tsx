import * as React from "react";
import * as URL from "url";
import { stringify } from "qs";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";
import * as ReactDOMServer from "react-dom/server";
import * as ReactRouterRedux from "react-router-redux";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { matchPath } from "react-router-dom";
import * as fs from "fs";
import { staticHTMLWrapper } from "../helpers/htmlWrapper";
import CssInjector, { css } from "../helpers/cssInjector";
import { ConnectedRootRoutes as RootRoutes, routesMap } from "../routes";
import StoreManager from "../store";
import getResponseObjectForRobot from "./handleRobots";
import ErrorTracker from "../helpers/errorHandler";
import EnvChecker from "../helpers/envChecker";
import * as DeployConfig from "../../scripts/deploy/config";
import { initialState } from "../reducers";
import handleSiteMapRequest from "./handleSitemap";
import { ACTION_TYPES } from "../actions/actionTypes";
import getQueryParamsObject from "../helpers/getQueryParamsObject";
import { TIMEOUT_FOR_SAFE_RENDERING } from "../api/pluto";
const AWSXRay = require("aws-xray-sdk");

interface ServerSideRenderParams {
  requestUrl: string;
  scriptPath: string;
  userAgent?: string;
  queryParamsObject?: object;
}

const SITEMAP_REGEX = /\/sitemap.*/;

export function getPathWithQueryParams(pathName: string, queryParams: object | null) {
  if (queryParams) {
    const stringifiedQueryParams = stringify(queryParams, { addQueryPrefix: true, allowDots: true });
    return pathName + stringifiedQueryParams;
  } else {
    return pathName;
  }
}

export async function serverSideRender({ requestUrl, scriptPath, queryParamsObject }: ServerSideRenderParams) {
  StoreManager.initializeStore();
  const store = StoreManager.store;
  const url = URL.parse(requestUrl);
  const pathname = url.pathname!;
  const queryParams = getQueryParamsObject(queryParamsObject || url.search);

  const promises: Array<Promise<any>> = [];
  routesMap.some(route => {
    const match = matchPath(pathname, route);
    if (match && !!route.loadData) {
      promises.push(route.loadData({ dispatch: store.dispatch, match, queryParams, pathname }));
    }
    return !!match;
  });

  await Promise.all(promises)
    .then(() => {
      store.dispatch({ type: ACTION_TYPES.GLOBAL_SUCCEEDED_TO_INITIAL_DATA_FETCHING });
    })
    .catch(err => {
      console.error(`Fetching data error at server - ${err}`);
    });

  store.dispatch(ReactRouterRedux.push(getPathWithQueryParams(pathname, queryParams)));

  const renderedHTML = ReactDOMServer.renderToString(
    <ErrorTracker>
      <CssInjector>
        <Provider store={store}>
          <MuiThemeProvider>
            <ReactRouterRedux.ConnectedRouter history={StoreManager.history}>
              <RootRoutes />
            </ReactRouterRedux.ConnectedRouter>
          </MuiThemeProvider>
        </Provider>
      </CssInjector>
    </ErrorTracker>,
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

export function renderJavaScriptOnly(scriptPath: string) {
  const helmet = Helmet.renderStatic();
  const cssArr = Array.from(css);
  const fullHTML: string = staticHTMLWrapper("", scriptPath, helmet, JSON.stringify(initialState), cssArr.join(""));

  return fullHTML;
}

export async function handler(event: Lambda.Event, context: Lambda.Context) {
  if (EnvChecker.isServer()) {
    const LAMBDA_SERVICE_NAME = "pluto-web-client";
    const path = event.path!;
    const version = fs.readFileSync("./version");
    const bundledJsForBrowserPath = `${DeployConfig.CDN_BASE_PATH}/${
      DeployConfig.AWS_S3_FOLDER_PREFIX
    }/${version}/bundleBrowser.js`;

    AWSXRay.captureHTTPsGlobal(require("http"));
    AWSXRay.captureAWS(require("aws-sdk"));

    let requestPath: string;
    if (path === `/${LAMBDA_SERVICE_NAME}`) {
      requestPath = "/";
    } else {
      requestPath = path.replace(`/${LAMBDA_SERVICE_NAME}`, "");
    }

    console.log(`The user requested at: ${requestPath}`);

    if (requestPath === "/robots.txt") {
      return context.succeed(getResponseObjectForRobot(event.requestContext!.stage));
    }

    if (requestPath.search(SITEMAP_REGEX) !== -1) {
      return handleSiteMapRequest(requestPath, context);
    }

    const getSafeResponse = async (): Promise<string> => {
      try {
        const html = await serverSideRender({
          requestUrl: requestPath,
          scriptPath: bundledJsForBrowserPath,
          queryParamsObject: event.queryStringParameters,
        });
        return html;
      } catch (err) {
        console.error(`============== Server has error on server side rendering: ${err}`);
        return renderJavaScriptOnly(bundledJsForBrowserPath);
      }
    };

    const fallbackRender = new Promise((resolve, _reject) => {
      const html = renderJavaScriptOnly(bundledJsForBrowserPath);
      setTimeout(
        () => {
          console.log("============== FALLBACK RENDERING FIRED! ==============");
          resolve(html);
        },
        TIMEOUT_FOR_SAFE_RENDERING,
        html,
      );
    });

    Promise.race([getSafeResponse(), fallbackRender])
      .then(responseBody => {
        return context.succeed({
          statusCode: 200,
          headers: {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
          },
          body: responseBody,
        });
      })
      .catch(err => {
        console.error(err, "Error at the race");
        return context.succeed({
          statusCode: 200,
          headers: {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
          },
          body: renderJavaScriptOnly(bundledJsForBrowserPath),
        });
      });
  }
}
