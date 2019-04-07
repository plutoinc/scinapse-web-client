import * as path from "path";
import * as http from "http";
import * as https from "https";
import * as DeployConfig from "../deploy/config";
import * as s3 from "s3";
const s3client = s3.createClient({
  s3Options: {
    region: "us-east-1",
  },
});

http.globalAgent.maxSockets = https.globalAgent.maxSockets = 20;

export async function uploadProdClientFiles() {
  return await new Promise((resolve, reject) => {
    const prefix = DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX;
    const cacheControl = "public, max-age=604800";
    const params = {
      localDir: path.resolve(__dirname, "../../dist"),
      s3Params: {
        Bucket: DeployConfig.AWS_S3_BUCKET,
        Prefix: prefix,
        CacheControl: cacheControl,
        ACL: "public-read",
      },
    };
    const uploader = s3client.uploadDir(params);
    uploader.on("error", function(err: Error) {
      console.error("unable to sync:", err.stack);
      reject();
    });
    uploader.on("progress", function() {
      console.log("progress", uploader.progressAmount, uploader.progressTotal);
    });
    uploader.on("end", function() {
      console.log("done uploading");
      resolve();
    });
  });
}

export function uploadDevClientFiles() {
  return new Promise((resolve, reject) => {
    const prefix = `${DeployConfig.AWS_S3_DEV_FOLDER_PREFIX}/${process.env.BRANCH_NAME}`;
    const cacheControl = "public, max-age=0";

    const params = {
      localDir: path.resolve(__dirname, "../../dist"),
      s3Params: {
        Bucket: DeployConfig.AWS_S3_BUCKET,
        Prefix: prefix,
        CacheControl: cacheControl,
        ACL: "public-read",
      },
    };

    const uploader = s3client.uploadDir(params);
    uploader.on("error", function(err: Error) {
      console.error("unable to sync:", err.message);
      reject();
    });
    uploader.on("progress", function() {
      console.log("progress", uploader.progressAmount, uploader.progressTotal);
    });
    uploader.on("end", function() {
      console.log("done uploading");
      resolve();
    });
  });
}
