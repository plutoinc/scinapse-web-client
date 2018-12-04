import * as AWS from "aws-sdk";
import * as DeployConfig from "../../scripts/deploy/config";
const fs = require("fs");
const s3 = new AWS.S3();

class DevRenderer {
  public async render(event: Lambda.Event) {
    const branch = this.getTargetBranch(event);
    const version = await this.getVersion(event, branch);
    await this.downloadJSFromS3(version, branch);
    const bundle = require("/tmp/bundle.js");
    const render = bundle.ssr;

    let result: string;
    if (branch === "master") {
      result = await render({ ...event, queryStringParameters: { branch: "master", version } });
    } else {
      result = await render(event);
    }

    return result;
  }

  private getTargetBranch(event: Lambda.Event) {
    let targetBranch: string = "master";
    if (event.queryStringParameters && event.queryStringParameters.branch) {
      try {
        console.log("GET BRANCH_NAME FROM BRANCH QUERYPARAMS");
        const demoBranch = decodeURIComponent(event.queryStringParameters.branch);
        targetBranch = demoBranch;
      } catch (err) {
        console.error(err);
      }
    }

    console.log(`targetBranch is ${targetBranch}`);

    return targetBranch;
  }

  private async getVersion(event: Lambda.Event, targetBranch: string): Promise<string> {
    console.log(event.queryStringParameters);
    if (targetBranch !== "master") {
      return targetBranch;
    }

    try {
      const versionResponse = await s3
        .getObject({
          Bucket: DeployConfig.AWS_S3_BUCKET,
          Key: "version",
        })
        .promise();

      console.log("SUCCEEDED GET THE LATEST VERSION FILE TO GET MASTER BRANCH VERSION");
      if (versionResponse.Body) {
        const version = (versionResponse.Body as Buffer).toString("utf8");
        console.log("SUCCEEDED SET THE LATEST VERSION FILE TO GET MASTER BRANCH VERSION");
        return version;
      }
      return "master";
    } catch (err) {
      console.log("ERROR OCCURRED WHEN DURING DOWNLOAD THE LATEST VERSION FILE");
      console.error(err);
      throw err;
    }
  }

  private async downloadJSFromS3(version: string, targetBranch: string) {
    let targetKey: string = `${DeployConfig.AWS_S3_DEV_FOLDER_PREFIX}/${version}/bundle.js`;

    if (targetBranch === "master") {
      targetKey = `${DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX}/${version}/bundle.js`;
    }

    await new Promise((resolve, _reject) => {
      console.log(`BUNDLE ALREADY EXISTS? ${fs.existsSync("/tmp/bundle.js")}`);

      if (fs.existsSync("/tmp/bundle.js")) {
        fs.unlinkSync("/tmp/bundle.js");
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

  const devRenderer = new DevRenderer();
  const result = await devRenderer.render(event);
  return result;
}

export const ssr = handler;
