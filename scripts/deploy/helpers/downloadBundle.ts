import * as DeployConfig from "../config";
const s3 = require("s3");

export default async function downloadBundleFromS3(VERSION: string) {
  console.log("Start to download bundled javascript file from S3");
  const s3Client = s3.createClient(DeployConfig.S3_CLIENT_OPTIONS);
  let downloader: DeployConfig.S3ClientUploaderDownloaderOptions;

  await new Promise(async (resolve, reject) => {
    const targetPrefix = `${DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX}/${VERSION}/bundle.js`;

    downloader = s3Client.downloadFile({
      localDir: DeployConfig.APP_DEST,
      s3Params: {
        Bucket: DeployConfig.AWS_S3_BUCKET,
        Prefix: targetPrefix,
        ACL: "public-read",
      },
    });

    downloader.on("error", (err: Error) => {
      console.error("unable to sync:", err.stack);
      reject(err);
    });

    downloader.on("progress", () => {
      console.log("progress", downloader.progressAmount, downloader.progressTotal);
    });

    downloader.on("end", () => {
      console.log("END to upload dist files to S3");
      resolve();
    });
  }).catch(err => {
    console.error(err);
  });
}
