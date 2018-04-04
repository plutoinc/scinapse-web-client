import * as React from "react";
import * as URL from "url";
import { parse, stringify } from "qs";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";
import * as ReactDOMServer from "react-dom/server";
import * as ReactRouterRedux from "react-router-redux";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { matchPath } from "react-router-dom";
import * as fs from "fs";
import * as AWS from "aws-sdk";
import { staticHTMLWrapper } from "../helpers/htmlWrapper";
import CssInjector, { css } from "../helpers/cssInjector";
import { ConnectedRootRoutes as RootRoutes, routesMap } from "../routes";
import StoreManager from "../store";
import getResponseObjectForRobot from "./handleRobots";
import EnvChecker from "../helpers/envChecker";
import * as LambdaProxy from "../typings/lambda";
import * as DeployConfig from "../../scripts/deploy/config";
import { initialState } from "../reducers";

interface ServerSideRenderParams {
  requestUrl: string;
  scriptPath: string;

  userAgent?: string;
  queryParamsObject?: object;
}

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

export async function serverSideRender({ requestUrl, scriptPath, queryParamsObject }: ServerSideRenderParams) {
  StoreManager.initializeStore();
  const store = StoreManager.store;

  const url = URL.parse(requestUrl);
  const pathname = url.pathname;
  const queryParams = getQueryParamsObject(queryParamsObject || url.search);

  const promises: Array<Promise<any>> = [];
  routesMap.some(route => {
    const match = matchPath(pathname, route);
    if (match && !!route.loadData) {
      promises.push(route.loadData({ dispatch: store.dispatch, match, queryParams }));
    }
    return !!match;
  });

  await Promise.all(promises).catch(err => {
    console.error(`Fetching data error at server - ${err}`);
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

export function renderJavaScriptOnly(scriptPath: string) {
  const helmet = Helmet.renderStatic();
  const cssArr = Array.from(css);
  const fullHTML: string = staticHTMLWrapper("", scriptPath, helmet, JSON.stringify(initialState), cssArr.join(""));

  return fullHTML;
}

export async function handler(event: LambdaProxy.Event, context: LambdaProxy.Context) {
  if (EnvChecker.isServer()) {
    const LAMBDA_SERVICE_NAME = "pluto-web-client";
    const path = event.path;
    const version = fs.readFileSync("./version");
    const bundledJsForBrowserPath = `${DeployConfig.CDN_BASE_PATH}/${
      DeployConfig.AWS_S3_FOLDER_PREFIX
    }/${version}/bundleBrowser.js`;

    let requestPath: string;
    if (path === `/${LAMBDA_SERVICE_NAME}`) {
      requestPath = "/";
    } else {
      requestPath = path.replace(`/${LAMBDA_SERVICE_NAME}`, "");
    }

    if (requestPath === "/robots.txt") {
      return context.succeed(getResponseObjectForRobot(event.requestContext.stage));
    }

    if (requestPath === "/sitemap") {
      const s3 = new AWS.S3();
      const body = await new Promise((resolve, reject) => {
        s3.getObject(
          {
            Bucket: "pluto-academic",
            Key: "sitemap/sitemapindex.xml",
          },
          (err: Error, data: any) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(data.Body.toString("utf8"));
            }
          },
        );
      });

      return context.succeed({
        statusCode: 200,
        headers: {
          "Content-Type": "text/xml",
          "Access-Control-Allow-Origin": "*",
        },
        body,
      });
    }

    const getSafeResponse = async () => {
      try {
        const html = await serverSideRender({
          requestUrl: requestPath,
          scriptPath: bundledJsForBrowserPath,
          queryParamsObject: event.queryStringParameters,
        });
        return html;
      } catch (_err) {
        return renderJavaScriptOnly(bundledJsForBrowserPath);
      }
    };

    const safeTimeout = new Promise((resolve, _reject) => {
      const html = renderJavaScriptOnly(bundledJsForBrowserPath);
      setTimeout(resolve, 5000, html);
    });

    Promise.race([getSafeResponse(), safeTimeout])
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
