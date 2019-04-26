import * as s3 from "s3";
import * as DeployConfig from "../scripts/deploy/config";
const awsServerlessExpress = require("aws-serverless-express");
const s3client = s3.createClient({
  s3Options: {
    region: "us-east-1",
  },
});

function downloadSrcFromS3(branch?: string) {
  return new Promise((resolve, reject) => {
    const prefix = branch
      ? `${DeployConfig.AWS_S3_DEV_FOLDER_PREFIX}/${branch}`
      : DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX;
    const params = {
      localDir: "/tmp",
      s3Params: {
        Bucket: DeployConfig.AWS_S3_BUCKET,
        Prefix: prefix,
      },
    };

    const downloader = s3client.downloadDir(params);
    downloader.on("error", function(err: Error) {
      console.error("unable to sync:", err.stack);
      reject();
    });
    downloader.on("end", function() {
      console.log("done downloading");
      resolve();
    });
  });
}

export const ssr = async (event: any, context: any) => {
  const branch = event.queryStringParameters && event.queryStringParameters.branch;
  await downloadSrcFromS3(branch);
  const bundle = require("/tmp/server/main.js");
  const app = bundle.ssr;
  const binaryMimeTypes = [
    "application/xml",
    "text/xml",
    "text/html",
    "application/xml",
    "text/javascript",
    "application/javascript",
  ];
  const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);
  return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
};
