import * as AWS from "aws-sdk";
import { Helmet } from "react-helmet";
import * as DeployConfig from "../../scripts/deploy/config";
import { staticHTMLWrapper } from "../helpers/htmlWrapper";
const fs = require("fs");
const s3 = new AWS.S3();

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

  public async render(event: Lambda.Event, context: Lambda.Context) {
    await this.downloadJSFromS3();
    const bundle = require("/tmp/bundle.js");
    console.log(bundle, "===bundle");
    const render = bundle.ssr;
    render(event, context);
  }

  private async downloadJSFromS3() {
    await new Promise((resolve, _reject) => {
      if (fs.existsSync("/tmp/bundle.js")) {
        fs.unlinkSync("/tmp/bundle.js");
      }
      const writeStream = fs.createWriteStream("/tmp/bundle.js");

      s3
        .getObject({
          Bucket: DeployConfig.AWS_S3_BUCKET,
          Key: `${DeployConfig.AWS_S3_STAGE_FOLDER_PREFIX}/${this.branchName}/bundle.js`,
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
  const path = event.path;
  const queryParamsObj = event.queryStringParameters;
  console.log(JSON.stringify(queryParamsObj), "=== queryParamsObj");

  if (!queryParamsObj || !queryParamsObj.branch) {
    return context.succeed({
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
      },
      body: renderJavaScriptOnly(`${DeployConfig.CDN_BASE_PATH}/bundleBrowser.js`),
    });
  }

  const stageRenderer = new StageRenderer(decodeURIComponent(queryParamsObj.branch));
  stageRenderer.render(event, context);
}

export const ssr = handler;
