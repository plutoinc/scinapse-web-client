import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as DeployConfig from "../scripts/deploy/config";
const awsServerlessExpress = require("aws-serverless-express");
const s3 = new AWS.S3();

class DevRenderer {
  public async getApp(event: any) {
    let branch: string = "master";

    if (event.queryStringParameters && event.queryStringParameters.branch) {
      try {
        const demoBranch = decodeURIComponent(event.queryStringParameters.branch);
        branch = demoBranch;
      } catch (err) {
        console.error(err);
      }
    }

    const version = await this.getVersion(branch || "master");

    if (version) {
      await this.downloadJSFromS3(version, branch);
    }

    const bundle = require("/tmp/bundle.js");
    const handler = bundle.ssr;
    return handler;
  }

  private async getVersion(branch: string): Promise<string | undefined> {
    if (branch !== "master") return branch;

    try {
      const versionResponse = await s3
        .getObject({
          Bucket: DeployConfig.AWS_S3_BUCKET,
          Key: "version",
        })
        .promise();

      console.log("SUCCEEDED GET THE LATEST VERSION FILE TO GET MASTER BRANCH VERSION", versionResponse);
      if (versionResponse.Body) {
        const version = (versionResponse.Body as Buffer).toString("utf8");
        fs.writeFileSync("/tmp/version", version);
        console.log("SUCCEEDED SET THE LATEST VERSION FILE TO GET MASTER BRANCH VERSION ===", version);
        return version;
      }
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

exports.ssr = async (event: any, context: any) => {
  const devRenderer = new DevRenderer();
  const app = await devRenderer.getApp(event);
  const binaryMimeTypes = ["application/xml", "text/xml", "text/html", "application/xml"];
  const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);
  return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
};
