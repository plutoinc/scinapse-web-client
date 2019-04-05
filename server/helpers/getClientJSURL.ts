import * as fs from "fs";
import * as path from "path";
import * as DeployConfig from "../../scripts/deploy/config";

export default async function getClientJSURL(branch: string | null) {
  let version: string = "";
  let jsPath: string = "";

  if (process.env.NODE_ENV === "production") {
    version = fs.readFileSync(path.resolve(__dirname, "./version")).toString("utf8");
    jsPath = `${DeployConfig.CDN_BASE_HOST}/${
      DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX
    }/${version}/bundleBrowser.js`;
  } else if (process.env.NODE_ENV === "dev") {
    if (!branch) {
      version = fs.readFileSync("/tmp/version").toString("utf8");
      jsPath = `${DeployConfig.CDN_BASE_HOST}/${
        DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX
      }/${version}/bundleBrowser.js`;
    } else if (branch && branch !== "master") {
      jsPath = `${DeployConfig.CDN_BASE_HOST}/${DeployConfig.AWS_S3_DEV_FOLDER_PREFIX}/${decodeURIComponent(
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
