import * as fs from "fs";
import * as React from "react";
import * as URL from "url";
import * as AWS from "aws-sdk";
import { stringify } from "qs";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";
import * as ReactDOMServer from "react-dom/server";
import * as ReactRouterRedux from "connected-react-router";
import { matchPath } from "react-router-dom";
import { createMuiTheme, createGenerateClassName, MuiThemeProvider } from "@material-ui/core/styles";
import { staticHTMLWrapper } from "../helpers/htmlWrapper";
import CssInjector, { css } from "../helpers/cssInjector";
import { ConnectedRootRoutes as RootRoutes, routesMap } from "../routes";
import StoreManager from "../store";
import getResponseObjectForRobot from "./handleRobots";
import ErrorTracker from "../helpers/errorHandler";
import * as DeployConfig from "../../scripts/deploy/config";
import { initialState } from "../reducers";
import handleSiteMapRequest from "./handleSitemap";
import { ACTION_TYPES } from "../actions/actionTypes";
import getQueryParamsObject from "../helpers/getQueryParamsObject";
import { TIMEOUT_FOR_SAFE_RENDERING } from "../api/pluto";
const AWSXRay = require("aws-xray-sdk");
const { SheetsRegistry } = require("react-jss/lib/jss");
const JssProvider = require("react-jss/lib/JssProvider").default;
const cloudwatch = new AWS.CloudWatch();

type RENDERING_TYPE = "NORMAL RENDERING" | "ERROR HANDLING RENDERING" | "FALLBACK RENDERING";

interface ServerSideRenderParams {
  requestUrl: string;
  scriptPath: string;
  userAgent?: string;
  queryParamsObject?: object;
}

const SITEMAP_REGEX = /\/sitemap.*/;

export function getPathWithQueryParams(pathName: string, queryParams: object | null) {
  if (queryParams) {
    const stringifiedQueryParams = stringify(queryParams, {
      addQueryPrefix: true,
      allowDots: true,
    });
    return pathName + stringifiedQueryParams;
  } else {
    return pathName;
  }
}

export async function serverSideRender({ requestUrl, scriptPath, queryParamsObject }: ServerSideRenderParams) {
  // Parse request pathname and queryParams
  const url = URL.parse(requestUrl);
  const pathname = url.pathname!;
  const queryParams = getQueryParamsObject(queryParamsObject || url.search);
  // Initialize and make Redux store per each request
  StoreManager.initializeStore(getPathWithQueryParams(pathname, queryParams));
  const store = StoreManager.store;
  // Create Material-UI theme and sheet
  const sheetsRegistry = new SheetsRegistry();
  const theme = createMuiTheme();
  const generateClassName = createGenerateClassName();

  // Load data from API server
  const promises: Array<Promise<any>> = [];
  routesMap.some(route => {
    const match = matchPath(pathname, route);
    if (match && !!route.loadData) {
      promises.push(
        route.loadData({
          dispatch: store.dispatch,
          match,
          queryParams,
          pathname,
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

  const renderedHTML = ReactDOMServer.renderToString(
    <ErrorTracker>
      <CssInjector>
        <Provider store={store}>
          <ReactRouterRedux.ConnectedRouter history={StoreManager.history}>
            <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
              <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
                <RootRoutes />
              </MuiThemeProvider>
            </JssProvider>
          </ReactRouterRedux.ConnectedRouter>
        </Provider>
      </CssInjector>
    </ErrorTracker>
  );

  const materialUICss = sheetsRegistry.toString();
  const cssArr = Array.from(css);
  const helmet = Helmet.renderStatic();
  const currentState = store.getState();
  const stringifiedInitialReduxState = JSON.stringify(currentState);

  const fullHTML: string = await staticHTMLWrapper(
    renderedHTML,
    scriptPath,
    helmet,
    stringifiedInitialReduxState,
    cssArr.join("") + materialUICss
  );

  return fullHTML;
}

export function renderJavaScriptOnly(scriptPath: string) {
  const helmet = Helmet.renderStatic();
  const fullHTML: string = staticHTMLWrapper("", scriptPath, helmet, JSON.stringify(initialState), "");

  return fullHTML;
}

export async function handler(event: Lambda.Event, context: Lambda.Context) {
  /* ******
  *********  ABOUT RENDERING METHODS *********
  There are 3 kinds of the rendering methods in Scinapse server rendering.

  *********************************************************************************
  ** NAME **** NORMAL RENDERING ** ERROR HANDLING RENDERING ** FALLBACK REDERING **
  *********************************************************************************
  * NORMAL RENDERING
    - CAUSE
      Succeeded to rendering everything.
    - RESULT
      FULL HTML

  * ERROR HANDLING RENDERING
    - CAUSE
      An error occurred during the rendering process.
    - RESULT
      Empty content HTML with <script> tag which contains bundled javascript address for client.

  * FALLBACK RENDERING
    - CAUSE
      Timeout occurred during the rendering process.
    - RESULT
      Empty content HTML with <script> tag which contains bundled javascript address for client.

  ******** */

  const LAMBDA_SERVICE_NAME = "pluto-web-client";
  const path = event.path!;
  const queryParamsObj = event.queryStringParameters;
  let succeededToServerRendering = false;

  let bundledJsForBrowserPath: string;
  if (queryParamsObj && queryParamsObj.branch) {
    bundledJsForBrowserPath = `${DeployConfig.CDN_BASE_PATH}/${
      DeployConfig.AWS_S3_STAGE_FOLDER_PREFIX
    }/${decodeURIComponent(queryParamsObj.branch)}/bundleBrowser.js`;
  } else {
    const version = fs.readFileSync("./version");
    bundledJsForBrowserPath = `${DeployConfig.CDN_BASE_PATH}/${
      DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX
    }/${version}/bundleBrowser.js`;
  }

  AWSXRay.captureHTTPsGlobal(require("http"));
  AWSXRay.captureAWS(require("aws-sdk"));

  let requestPath: string;
  if (path === `/${LAMBDA_SERVICE_NAME}`) {
    requestPath = "/";
  } else {
    requestPath = path.replace(`/${LAMBDA_SERVICE_NAME}`, "");
  }

  console.log(`The user requested at: ${requestPath} with ${JSON.stringify(queryParamsObj)}`);

  // Handling '/robots.txt' path
  if (requestPath === "/robots.txt") {
    return context.succeed(getResponseObjectForRobot(event.requestContext!.stage));
  }

  // handling '/sitemap' path
  if (requestPath.search(SITEMAP_REGEX) !== -1) {
    return handleSiteMapRequest(requestPath, context);
  }

  const normalRender = async (): Promise<string> => {
    try {
      const html = await serverSideRender({
        requestUrl: requestPath,
        scriptPath: bundledJsForBrowserPath,
        queryParamsObject: queryParamsObj,
      });

      const buf = new Buffer(html);
      if (buf.byteLength > 6291456 /* 6MB */) {
        throw new Error("The result HTML size is more than AWS Lambda limitation.");
      }

      succeededToServerRendering = true;

      if (succeededToServerRendering) {
        await new Promise(resolve => {
          cloudwatch.putMetricData(makeRenderingCloudWatchMetricLog("NORMAL RENDERING"), err => {
            if (err) {
              console.log(err);
            }
            resolve();
          });
        });
      }

      return html;
    } catch (err) {
      console.error(`Had error during the normal rendering with ${err}`);
      cloudwatch.putMetricData(makeRenderingCloudWatchMetricLog("ERROR HANDLING RENDERING"));
      return renderJavaScriptOnly(bundledJsForBrowserPath);
    }
  };

  const fallbackRender = new Promise((resolve, _reject) => {
    const html = renderJavaScriptOnly(bundledJsForBrowserPath);
    setTimeout(
      () => {
        succeededToServerRendering = false;

        if (!succeededToServerRendering) {
          cloudwatch.putMetricData(makeRenderingCloudWatchMetricLog("FALLBACK RENDERING"));
        }

        resolve(html);
      },
      TIMEOUT_FOR_SAFE_RENDERING,
      html
    );
  });

  Promise.race([normalRender(), fallbackRender]).then(responseBody => {
    return context.succeed({
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
      },
      body: responseBody,
    });
  });
}

function makeRenderingCloudWatchMetricLog(renderingType: RENDERING_TYPE) {
  return {
    MetricData: [
      {
        MetricName: renderingType,
        Timestamp: new Date(),
        Value: 1,
      },
    ],
    Namespace: "SCINAPSE RENDERING",
  };
}
