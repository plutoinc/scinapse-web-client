import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as DeployConfig from "../config";
const s3 = new AWS.S3();

export default async function downloadBundleFromS3(VERSION: string) {
  console.log("Start to download bundled javascript file from S3");

  await new Promise(async (resolve, reject) => {
    const key = `${DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX}/${VERSION}/bundle.js`;
    console.log(key, " === downloadFile Prefix");

    if (fs.existsSync(`${DeployConfig.APP_DEST}/bundle.js`)) {
      fs.unlinkSync(`${DeployConfig.APP_DEST}/bundle.js`);
    }

    const writeStream = fs.createWriteStream(`${DeployConfig.APP_DEST}/bundle.js`);

    s3.getObject({
      Bucket: DeployConfig.AWS_S3_BUCKET,
      Key: key,
    })
      .createReadStream()
      .pipe(writeStream);

    writeStream.on("error", () => {
      console.error("===ERROR=== ERROR! HAD FAILED TO DOWNLOAD BUNDLED JAVASCRIPT FILE! ==========");
      reject();
    });

    writeStream.on("finish", () => {
      console.log("========== Downloaded bundled javascript file for server rendering ==========");
      resolve();
    });
  }).catch(err => {
    console.error(err);
  });
}
