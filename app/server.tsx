import * as React from "react";
import { applyMiddleware, createStore, Middleware } from "redux";
import { Provider } from "react-redux";
import * as ReactDOMServer from "react-dom/server";
import { createMemoryHistory } from "history";
import { StaticRouter, matchPath } from "react-router-dom";
import * as ReactRouterRedux from "react-router-redux";
import thunkMiddleware from "redux-thunk";
import { staticHTMLWrapper } from "./helpers/htmlWrapper";
import CssInjector, { css } from "./helpers/cssInjector";
import { ConnectedRootRoutes as RootRoutes, routesMap } from "./routes";
import { rootReducer, initialState, AppState } from "./reducers";
// import * as fs from "fs";
// import EnvChecker from "./helpers/envChecker";
// import * as LambdaProxy from "./typings/lambda";
// import * as DeployConfig from "../scripts/builds/config";

export async function serverSideRender(requestUrl: string, scriptPath: string) {
  const promises: Array<Promise<any>> = [];
  const history = createMemoryHistory();
  const routerMid: Middleware = ReactRouterRedux.routerMiddleware(history);
  const AppInitialState = initialState;

  const store = createStore<AppState>(rootReducer, AppInitialState, applyMiddleware(routerMid, thunkMiddleware));

  routesMap.some(route => {
    const match = matchPath(requestUrl, route);

    if (match && route.loadData) {
      promises.push(route.loadData({ store, match }));
    }
    return !!match;
  });

  await Promise.all(promises)
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.error(err);
    });

  const renderedHTML = ReactDOMServer.renderToString(
    <CssInjector>
      <StaticRouter location={requestUrl}>
        <Provider store={store}>
          <RootRoutes />
        </Provider>
      </StaticRouter>
    </CssInjector>,
  );

  const cssArr = Array.from(css);

  const currentState = store.getState();
  const stringifiedInitialReduxState = JSON.stringify(currentState);

  const fullHTML: string = await staticHTMLWrapper(
    renderedHTML,
    scriptPath,
    stringifiedInitialReduxState,
    cssArr.join(""),
  );
  return fullHTML;
}

// // Lambda Handler
// export async function handler(event: LambdaProxy.Event, context: LambdaProxy.Context) {
//   if (EnvChecker.isServer()) {
//     const LAMBDA_SERVICE_NAME = "serverless-unviversal-app";
//     const path = event.path;
//     const version = fs.readFileSync("./version");

//     let requestPath: string;
//     if (path === `/${LAMBDA_SERVICE_NAME}`) {
//       requestPath = "/";
//     } else {
//       requestPath = path.replace(`/${LAMBDA_SERVICE_NAME}`, "");
//     }

//     try {
//       const bundledJsForBrowserPath = `https://s3.amazonaws.com/${DeployConfig.AWS_S3_BUCKET}/${
//         DeployConfig.AWS_S3_FOLDER_PREFIX
//       }/${version}/bundleBrowser.js`;
//       const response = await serverSideRender(requestPath, bundledJsForBrowserPath);
//       context.succeed({
//         statusCode: 200,
//         headers: {
//           "Content-Type": "text/html",
//           "Access-Control-Allow-Origin": "*",
//         },
//         body: response,
//       });
//     } catch (e) {
//       context.succeed({
//         statusCode: 500,
//         headers: {
//           "Content-Type": "text/html",
//           "Access-Control-Allow-Origin": "*",
//         },
//         body: JSON.stringify(e.meesage),
//       });
//     }
//   }
// }
