import * as DeployConfig from "../config";
const s3 = require("s3");

export default async function pushToS3(NEW_TAG: string) {
  console.log("Start to upload bundled javascript files to S3");

  const s3Client = s3.createClient(DeployConfig.S3_CLIENT_OPTIONS);

  let uploader: DeployConfig.S3ClientUploaderDownloaderOptions;

  await new Promise(async (resolve, reject) => {
    const isProduction = process.env.NODE_ENV === "production";

    console.log(process.env.NODE_ENV);

    const targetPrefix = isProduction
      ? `${DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX}/${NEW_TAG}`
      : `${DeployConfig.AWS_S3_STAGE_FOLDER_PREFIX}/${process.env.BRANCH_NAME}`;

    const cacheControl = isProduction ? "public, max-age=604800" : "public, max-age=0";

    if (!isProduction) {
      console.log("Trying to delete existing demo bundle javascript file.");
      await deleteExistDemoIfExist(DeployConfig.AWS_S3_BUCKET, targetPrefix);
    }

    uploader = s3Client.uploadDir({
      localDir: DeployConfig.APP_DEST,
      s3Params: {
        Bucket: DeployConfig.AWS_S3_BUCKET,
        Prefix: targetPrefix,
        CacheControl: cacheControl,
        ACL: "public-read",
      },
    });

    uploader.on("error", (err: Error) => {
      console.error("unable to sync:", err.stack);
      reject(err);
    });

    uploader.on("progress", () => {
      console.log("progress", uploader.progressAmount, uploader.progressTotal);
    });

    uploader.on("end", () => {
      console.log("END to upload dist files to S3");
      resolve();
    });
  }).catch(err => {
    console.error(err);
  });
}

async function deleteExistDemoIfExist(bucket: string, prefix: string) {
  const s3Client = s3.createClient(DeployConfig.S3_CLIENT_OPTIONS);

  await new Promise((resolve, reject) => {
    s3Client.s3.headObject(
      {
        Bucket: bucket,
        Key: `${prefix}/bundle.js`,
      },
      (err: any, _data: any) => {
        if (err && err.statusCode !== 404) {
          reject(new Error("Has Error to check bundle javascript file already existing."));
        } else if (err && err.statusCode === 404) {
          resolve();
        } else {
          const deleteDirManager = s3Client.deleteDir({
            Bucket: bucket,
            Prefix: prefix,
          });

          deleteDirManager.on("error", (error: Error) => {
            console.error("unable to sync:", error.stack);
            reject(error);
          });

          deleteDirManager.on("progress", () => {
            console.log("progress", deleteDirManager.progressAmount, deleteDirManager.progressTotal);
          });

          deleteDirManager.on("end", () => {
            console.log("END to upload dist files to S3");
            resolve();
          });
        }
      }
    );
  });
}
