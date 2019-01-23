import * as fs from "fs";
import * as React from "react";
import * as URL from "url";
import * as AWS from "aws-sdk";
import axios from "axios";
import { stringify } from "qs";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";
import * as ReactDOMServer from "react-dom/server";
import * as ReactRouterRedux from "connected-react-router";
import { matchPath } from "react-router-dom";
import { createMuiTheme, createGenerateClassName, MuiThemeProvider } from "@material-ui/core/styles";
import { generateFullHTML } from "../helpers/htmlWrapper";
import CssInjector from "../helpers/cssInjector";
import { ConnectedRootRoutes as RootRoutes, routesMap } from "../routes";
import StoreManager from "../store";
import getResponseObjectForRobot from "./handleRobots";
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

export interface ServerSideRenderParams {
  requestUrl: string;
  scriptVersion: string;
  userAgent?: string | string[];
  queryParamsObject?: object;
  version?: string;
  xForwardedFor?: string | string[];
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

export async function serverSideRender({
  requestUrl,
  scriptVersion,
  queryParamsObject,
  version,
  userAgent,
  xForwardedFor,
}: ServerSideRenderParams) {
  // Parse request pathname and queryParams
  const url = URL.parse(requestUrl);
  const pathname = url.pathname!;
  const queryParams = getQueryParamsObject(queryParamsObject || url.search || "");
  // Initialize and make Redux store per each request
  StoreManager.initializeStore(getPathWithQueryParams(pathname, queryParams));
  const store = StoreManager.store;
  // Create Material-UI theme and sheet
  const sheetsRegistry = new SheetsRegistry();
  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
  });
  const generateClassName = createGenerateClassName();

  console.log(axios.defaults.headers.common);

  axios.defaults.headers.common = {
    ...axios.defaults.headers.common,
    "User-Agent": userAgent || "",
    "X-Forwarded-For": xForwardedFor || "",
  };

  console.log("===========");
  console.log(axios.defaults.headers.common);

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

  const renderedHTML = ReactDOMServer.renderToString(
    <CssInjector context={context}>
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
  );

  const materialUICss = sheetsRegistry.toString();
  const cssArr = Array.from(css);
  const helmet = Helmet.renderStatic();
  const currentState = store.getState();
  const stringifiedInitialReduxState = JSON.stringify(currentState);

  const fullHTML: string = await generateFullHTML({
    reactDom: renderedHTML,
    scriptPath: scriptVersion,
    helmet,
    initialState: stringifiedInitialReduxState,
    css: cssArr.join("") + materialUICss,
    version,
  });

  return fullHTML;
}

export function renderJavaScriptOnly(scriptPath: string, version: string) {
  const helmet = Helmet.renderStatic();
  const fullHTML: string = generateFullHTML({
    reactDom: "",
    scriptPath,
    helmet,
    initialState: JSON.stringify(initialState),
    css: "",
    version,
  });

  return fullHTML;
}

export async function handler(event: Lambda.Event, _context: Lambda.Context) {
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
  const path = event.path;
  const queryParamsObj = event.queryStringParameters;
  const isDevDemoRequest = queryParamsObj && queryParamsObj.branch;
  let succeededToServerRendering = false;
  let version: string;

  let bundledJsForBrowserPath: string;
  if (queryParamsObj && queryParamsObj.branch && queryParamsObj.branch === "master") {
    bundledJsForBrowserPath = `${DeployConfig.CDN_BASE_PATH}/${DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX}/${
      queryParamsObj.version
    }/bundleBrowser.js`;
    version = decodeURIComponent(queryParamsObj.branch);
  } else if (isDevDemoRequest) {
    bundledJsForBrowserPath = `${DeployConfig.CDN_BASE_PATH}/${
      DeployConfig.AWS_S3_DEV_FOLDER_PREFIX
    }/${decodeURIComponent(queryParamsObj.branch)}/bundleBrowser.js`;
    version = decodeURIComponent(queryParamsObj.branch);
  } else {
    AWSXRay.captureHTTPsGlobal(require("http"));
    AWSXRay.captureAWS(require("aws-sdk"));
    version = fs.readFileSync("./version").toString("utf8");
    bundledJsForBrowserPath = `${DeployConfig.CDN_BASE_PATH}/${
      DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX
    }/${version}/bundleBrowser.js`;
  }

  console.log(path, "=== path");

  const isHomeRequest = path === `/${LAMBDA_SERVICE_NAME}`;
  const requestPath = !path || isHomeRequest ? "/" : path.replace(`/${LAMBDA_SERVICE_NAME}`, "");

  console.log(`The user requested at: ${requestPath} with ${JSON.stringify(queryParamsObj)}`);

  // Handling '/robots.txt' path
  if (requestPath === "/robots.txt") {
    return getResponseObjectForRobot(event.requestContext!.stage);
  }

  // handling '/sitemap' path
  if (requestPath.search(SITEMAP_REGEX) !== -1) {
    return handleSiteMapRequest(requestPath);
  }

  const normalRender = async (): Promise<string> => {
    const html = await serverSideRender({
      requestUrl: requestPath,
      scriptVersion: bundledJsForBrowserPath,
      queryParamsObject: queryParamsObj,
      version,
      userAgent: event.headers["User-Agent"],
      xForwardedFor: event.headers["X-Forwarded-For"],
    });

    if (html) {
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
    } else {
      throw new Error("No HTML");
    }
  };

  const fallbackRender: Promise<string> = new Promise((resolve, _reject) => {
    const html = renderJavaScriptOnly(bundledJsForBrowserPath, version);
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

  let resBody: string;
  try {
    resBody = await Promise.race([normalRender(), fallbackRender]);
  } catch (err) {
    console.error(`Had error during the normal rendering with ${err}`);
    cloudwatch.putMetricData(makeRenderingCloudWatchMetricLog("ERROR HANDLING RENDERING"));
    resBody = renderJavaScriptOnly(bundledJsForBrowserPath, version);
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*",
    },
    body: resBody,
  };
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
