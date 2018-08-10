import * as AWS from "aws-sdk";
import * as DeployConfig from "../config";
import { DeleteObjectsRequest } from "../../../node_modules/aws-sdk/clients/s3";
const s3 = new AWS.S3();

export default async function pushToS3(NEW_TAG: string) {
  console.log("Start to upload bundled javascript files to S3");

  await new Promise(async (resolve, reject) => {
    const isProduction = process.env.NODE_ENV === "production";

    console.log(process.env.NODE_ENV);

    const targetPrefix = isProduction
      ? `${DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX}/${NEW_TAG}`
      : `${DeployConfig.AWS_S3_DEV_FOLDER_PREFIX}/${process.env.BRANCH_NAME}`;

    const cacheControl = isProduction ? "public, max-age=604800" : "public, max-age=0";

    if (!isProduction) {
      console.log("Trying to delete existing demo bundle javascript file.");
      await deleteExistDemoIfExist(DeployConfig.AWS_S3_BUCKET, targetPrefix);
    }

    // uploader = s3Client.uploadDir({
    //   localDir: DeployConfig.APP_DEST,
    //   s3Params: {
    //     Bucket: DeployConfig.AWS_S3_BUCKET,
    //     Prefix: targetPrefix,
    //     CacheControl: cacheControl,
    //     ACL: "public-read",
    //   },
    // });

    // uploader.on("error", (err: Error) => {
    //   console.error("unable to sync:", err.stack);
    //   reject(err);
    // });

    // uploader.on("progress", () => {
    //   console.log("progress", uploader.progressAmount, uploader.progressTotal);
    // });

    // uploader.on("end", () => {
    //   console.log("END to upload dist files to S3");
    //   resolve();
    // });
  }).catch(err => {
    console.error(err);
  });
}

async function deleteExistDemoIfExist(bucket: string, prefix: string) {
  await new Promise((resolve, reject) => {
    s3.headObject(
      {
        Bucket: bucket,
        Key: `${prefix}/bundle.js`,
      },
      (err: AWS.AWSError, _data: any) => {
        if (err && err.statusCode !== 404) {
          reject(new Error("Has Error to check bundle javascript file already existing."));
        } else if (err && err.statusCode === 404) {
          resolve();
        } else {
          s3.listObjects(
            {
              Bucket: bucket,
              Prefix: prefix,
            },
            (error, data) => {
              if (error) {
                return reject(error);
              }

              const deleteParams: DeleteObjectsRequest = { Bucket: bucket, Delete: { Objects: [] } };

              data.Contents.forEach(content => {
                deleteParams.Delete.Objects.push({ Key: content.Key });
              });

              s3.deleteObjects(deleteParams, (deleteError, _data) => {
                if (deleteError) {
                  return reject(deleteError);
                } else {
                  resolve();
                }
              });
            }
          );
        }
      }
    );
  });
}
