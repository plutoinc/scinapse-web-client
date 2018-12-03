import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as DeployConfig from "../config";
import { CopyObjectRequest, DeleteObjectsRequest, PutObjectRequest } from "../../../node_modules/aws-sdk/clients/s3";
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

    const filenameList = fs.readdirSync(DeployConfig.APP_DEST);

    if (filenameList && filenameList.length > 0) {
      const promiseMap = filenameList.map(filename => {
        const filenameArr = filename.split(".");
        const isJSFIle = filenameArr.pop() === "js";

        let params: PutObjectRequest;
        if (isJSFIle) {
          params = {
            Bucket: DeployConfig.AWS_S3_BUCKET,
            Body: fs.readFileSync(`${DeployConfig.APP_DEST}/${filename}`),
            Key: `${targetPrefix}/${filename}`,
            CacheControl: cacheControl,
            ACL: "public-read",
            ContentType: "application/javascript",
          };
        } else {
          params = {
            Bucket: DeployConfig.AWS_S3_BUCKET,
            Body: fs.readFileSync(`${DeployConfig.APP_DEST}/${filename}`),
            Key: `${targetPrefix}/${filename}`,
            CacheControl: cacheControl,
            ACL: "public-read",
          };
        }

        return s3.upload(params).promise();
      });

      if (isProduction) {
        promiseMap.push(
          s3
            .upload({
              Bucket: DeployConfig.AWS_S3_BUCKET,
              Body: fs.readFileSync("./version"),
              Key: "version",
              CacheControl: "public, max-age=0",
              ACL: "public-read",
            })
            .promise()
        );
      }

      await Promise.all(promiseMap)
        .then(async () => {
          if (isProduction) {
            console.log("Trying to copy last master build result to bucket root");
            await copyMasterBundleBrowserFileToRoot(NEW_TAG);
          }
          resolve();
        })
        .catch(err => {
          console.error(err);
          console.error(err.message);
          reject(err);
        });
    }
  });
}

async function copyMasterBundleBrowserFileToRoot(NEW_TAG: string) {
  // This is needed for basic dev server without version params. ex) https://dev.scinapse.io
  await new Promise((resolve, reject) => {
    const params: CopyObjectRequest = {
      CopySource: encodeURIComponent(
        `${DeployConfig.AWS_S3_BUCKET}/${DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX}/${NEW_TAG}/bundleBrowser.js`
      ),
      Bucket: DeployConfig.AWS_S3_BUCKET,
      Key: "bundleBrowser.js",
      ACL: "public-read",
      CacheControl: "public, max-age=0",
    };

    s3.copyObject(params)
      .promise()
      .then(() => {
        resolve();
      })
      .catch(err => {
        console.error(err);
        console.error(err.message);
        reject(err);
      });
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
              s3.deleteObjects(deleteParams, (deleteError, _result) => {
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
