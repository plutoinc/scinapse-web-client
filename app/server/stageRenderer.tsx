import * as AWS from "aws-sdk";
import { Helmet } from "react-helmet";
import { TIMEOUT_FOR_SAFE_RENDERING } from "../api/pluto";
import * as DeployConfig from "../../scripts/deploy/config";
import { staticHTMLWrapper } from "../helpers/htmlWrapper";
const fs = require("fs");
const s3 = new AWS.S3();

interface ServerSideRenderParams {
  requestUrl: string;
  scriptPath: string;
  userAgent?: string;
  queryParamsObject?: object;
}

function renderJavaScriptOnly(scriptPath: string) {
  const helmet = Helmet.renderStatic();
  const fullHTML: string = staticHTMLWrapper("", scriptPath, helmet, JSON.stringify({}), "");

  return fullHTML;
}

class StageRenderer {
  private branchName: string;

  constructor(branchName: string) {
    this.branchName = branchName;
  }

  public async render({ requestUrl, scriptPath, queryParamsObject }: ServerSideRenderParams) {
    await this.downloadJSFromS3();
    try {
      console.log(fs.existsSync("/tmp/bundle.js"), "file exist");
      const bundle = require("/tmp/bundle.js");
      console.log(bundle, "===bundle");
      const render = bundle.ssr;
      const html = await render({ requestUrl, scriptPath, queryParamsObject });
      return html;
    } catch (err) {
      console.error(err);
      console.log(err.message);
    }
  }

  private async downloadJSFromS3() {
    await new Promise((resolve, _reject) => {
      const writeStream = fs.createWriteStream("/tmp/bundle.js");

      s3.getObject({
        Bucket: DeployConfig.AWS_S3_BUCKET,
        Key: `${DeployConfig.AWS_S3_STAGE_FOLDER_PREFIX}/${this.branchName}/bundleBrowser.js`,
      })
        .createReadStream()
        .pipe(writeStream);

      writeStream.on("finish", resolve);
    });
  }
}

async function handler(event: Lambda.Event, context: Lambda.Context) {
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

  let bundledJsForBrowserPath: string;
  bundledJsForBrowserPath = `${DeployConfig.CDN_BASE_PATH}/${
    DeployConfig.AWS_S3_STAGE_FOLDER_PREFIX
  }/${decodeURIComponent(queryParamsObj.branch)}/bundleBrowser.js`;

  const isHomeRequest = path === `/${LAMBDA_SERVICE_NAME}`;
  const requestPath = isHomeRequest ? "/" : path.replace(`/${LAMBDA_SERVICE_NAME}`, "");

  console.log(`The user requested at: ${requestPath} with ${JSON.stringify(queryParamsObj)}`);

  const normalRender = async (): Promise<string> => {
    try {
      const stageRenderer = new StageRenderer(decodeURIComponent(queryParamsObj.branch));
      const html = await stageRenderer.render({
        requestUrl: requestPath,
        scriptPath: bundledJsForBrowserPath,
        queryParamsObject: queryParamsObj,
      });

      const buf = new Buffer(html);
      if (buf.byteLength > 6291456 /* 6MB */) {
        throw new Error("The result HTML size is more than AWS Lambda limitation.");
      }

      return html;
    } catch (err) {
      console.error(`Had error during the normal rendering with ${err}`);
      console.error(err.message);
      return renderJavaScriptOnly(bundledJsForBrowserPath);
    }
  };

  const fallbackRender = new Promise((resolve, _reject) => {
    const html = renderJavaScriptOnly(bundledJsForBrowserPath);
    setTimeout(
      () => {
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

export const ssr = handler;
