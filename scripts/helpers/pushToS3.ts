import * as path from "path";
import * as http from "http";
import * as https from "https";
import * as DeployConfig from "../deploy/config";
import * as s3 from "s3";
import * as AWS from "aws-sdk";

const awsS3 = new AWS.S3({
  region: "us-east-1",
});

const s3client = s3.createClient({
  s3Options: {
    region: "us-east-1",
  },
});

http.globalAgent.maxSockets = https.globalAgent.maxSockets = 20;

export async function uploadProdFiles() {
  return await new Promise((resolve, reject) => {
    const prefix = DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX;
    const cacheControl = "public, max-age=31536000";
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

export function uploadDevFiles(version: string) {
  return new Promise(async (resolve, reject) => {
    const prefix = `${DeployConfig.AWS_S3_DEV_FOLDER_PREFIX}/${process.env.CIRCLE_BRANCH}/${version}`;
    const cacheControl = "public, max-age=0";

    const listRes = await awsS3.listObjects({ Bucket: DeployConfig.AWS_S3_BUCKET, Prefix: prefix }).promise();
    if (listRes.Contents && listRes.Contents.length > 0) {
      console.log(`START TO DELETE OLD FILES FROM ${prefix}`);
      const deleteParams: AWS.S3.Types.DeleteObjectsRequest = {
        Bucket: DeployConfig.AWS_S3_BUCKET,
        Delete: {
          Objects: [],
        },
      };

      listRes.Contents.forEach(content => {
        deleteParams.Delete.Objects.push({ Key: content.Key });
      });

      await awsS3.deleteObjects(deleteParams).promise();
      console.log("FINISH TO DELETE OLD FILES");
    }

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
