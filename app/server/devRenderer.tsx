import * as AWS from "aws-sdk";
import * as DeployConfig from "../../scripts/deploy/config";
const fs = require("fs");
const s3 = new AWS.S3();

class DevRenderer {
  private branchName: string | undefined;

  constructor(branchName?: string) {
    this.branchName = branchName;
  }

  public async render(event: Lambda.Event) {
    await this.downloadJSFromS3();
    const bundle = require("/tmp/bundle.js");
    console.log(bundle.ssr, "=== ssr");
    const render = bundle.ssr;
    const result = await render(event);
    return result;
  }

  private async downloadJSFromS3() {
    await new Promise(async (resolve, _reject) => {
      let targetKey: string = `${DeployConfig.AWS_S3_DEV_FOLDER_PREFIX}/${this.branchName}/bundle.js`;

      console.log(`BUNDLE ALREADY EXISTS? ${fs.existsSync("/tmp/bundle.js")}`);

      if (fs.existsSync("/tmp/bundle.js")) {
        fs.unlinkSync("/tmp/bundle.js");
      }

      if (!this.branchName) {
        try {
          const versionResponse = await s3
            .getObject({
              Bucket: DeployConfig.AWS_S3_BUCKET,
              Key: "version",
            })
            .promise();

          if (versionResponse.Body) {
            const version = (versionResponse.Body as Buffer).toString("utf-8");
            targetKey = `${DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX}/${version}/bundle.js`;
          }
        } catch (err) {
          console.log("ERROR OCCURRED WHEN DURING DOWNLOAD THE LATEST VERSION FILE");
          console.error(err);
          throw err;
        }
      }

      const writeStream = fs.createWriteStream("/tmp/bundle.js");

      console.log("JS TARGET KEY ===", targetKey);

      s3.getObject({
        Bucket: DeployConfig.AWS_S3_BUCKET,
        Key: targetKey,
      })
        .createReadStream()
        .pipe(writeStream);

      writeStream.on("finish", () => {
        console.log("FINISH TO WRITE STREAM");
        resolve();
      });
    });
  }
}

async function handler(event: Lambda.Event, _context: Lambda.Context) {
  const path = event.path;
  const queryParamsObj = event.queryStringParameters || {};

  console.log(JSON.stringify(event.queryStringParameters), "=== event.queryStringParameters");
  console.log(JSON.stringify(queryParamsObj), "=== queryParamsObj");

  console.log(event, "=== event at parent function");
  console.log(path, "=== path at parent function");

  let targetBranch: string | undefined;
  try {
    targetBranch = decodeURIComponent(queryParamsObj.branch);
  } catch (err) {
    console.error(err);
  }

  console.log(`targetBranch is ${targetBranch}`);
  const devRenderer = new DevRenderer(targetBranch);
  const result = await devRenderer.render(event);
  return result;
}

export const ssr = handler;
