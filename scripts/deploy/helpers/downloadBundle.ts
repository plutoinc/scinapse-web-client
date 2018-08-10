import * as AWS from "aws-sdk";
import * as DeployConfig from "../config";
const s3 = new AWS.S3();

export default async function downloadBundleFromS3(VERSION: string) {
  console.log("Start to download bundled javascript file from S3");

  await new Promise(async (resolve, reject) => {
    const key = `${DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX}/${VERSION}/bundle.js`;
    console.log(key, " === downloadFile Prefix");

    s3.getObject(
      {
        Bucket: DeployConfig.AWS_S3_BUCKET,
        Key: key,
      },
      (err: Error, _data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve("========== Downloaded bundled javascript file for server rendering ==========");
        }
      }
    );
  }).catch(err => {
    console.error(err);
  });
}
