import * as DeployConfig from "../config";
const s3 = require("s3");

export default async function downloadBundleFromS3(VERSION: string) {
  console.log("Start to download bundled javascript file from S3");
  const s3Client = s3.createClient(DeployConfig.S3_CLIENT_OPTIONS);
  let downloader: DeployConfig.S3ClientUploaderDownloaderOptions;

  await new Promise(async (resolve, reject) => {
    const key = `${DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX}/${VERSION}/bundle.js`;
    console.log(key, " === downloadFile Prefix");

    downloader = s3Client.downloadFile({
      localFile: `${DeployConfig.APP_DEST}/bundle.js`,
      s3Params: {
        Bucket: DeployConfig.AWS_S3_BUCKET,
        Key: key,
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
