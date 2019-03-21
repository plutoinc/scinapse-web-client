import * as fs from "fs";
import * as AWS from "aws-sdk";
import * as DeployConfig from "../../scripts/deploy/config";
const s3 = new AWS.S3();

export default async function getClientJSURL(branch: string | null) {
  let version: string = "";
  let jsPath: string = "";

  if (process.env.NODE_ENV === "production") {
    version = fs.readFileSync("./version").toString("utf8");
    jsPath = `${DeployConfig.CDN_BASE_PATH}/${
      DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX
    }/${version}/bundleBrowser.js`;
  } else if (process.env.NODE_ENV === "dev") {
    if (branch === "master") {
      const res = await s3
        .getObject({
          Bucket: DeployConfig.AWS_S3_BUCKET,
          Key: "version",
        })
        .promise();
      const productionPrefix = (res.Body as Buffer).toString("utf8");
      jsPath = `${DeployConfig.CDN_BASE_PATH}/${
        DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX
      }/${productionPrefix}/bundleBrowser.js`;
      version = branch;
    } else if (branch && branch !== "master") {
      jsPath = `${DeployConfig.CDN_BASE_PATH}/${DeployConfig.AWS_S3_DEV_FOLDER_PREFIX}/${decodeURIComponent(
        branch
      )}/bundleBrowser.js`;
      version = branch;
    }
  } else {
    // local === development
    version = "";
    jsPath = "http://localhost:8080/bundle.js";
  }

  return {
    version,
    jsPath,
  };
}
