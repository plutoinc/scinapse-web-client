import * as fs from "fs";
import * as LambdaProxy from "../../interfaces/lambda-proxy";
import { AWS_S3_FOLDER_PREFIX, AWS_S3_BUCKET } from "../../deploy/config";
import S3Helper from "../../helpers/s3Helper";

export default async function handler(
  _event: LambdaProxy.Event,
  _context: LambdaProxy.Context,
): Promise<LambdaProxy.Response> {
  const SOURCE_BUCKET = AWS_S3_BUCKET;
  const version = fs.readFileSync("./version").toString();
  const s3 = new S3Helper();
  const tmpFilePath = `/tmp/${version}.html`;
  let resultHTML = "";

  if (!fs.existsSync(tmpFilePath)) {
    // Fetch HTML
    try {
      resultHTML = await s3.getRemoteFile(SOURCE_BUCKET, `${AWS_S3_FOLDER_PREFIX}/${version}/index.html`);
    } catch (err) {
      alert(`Failed to get preview index.html file from s3: ${err}`);
    }
    // Write File
    await new Promise((resolve, reject) => {
      fs.writeFile(tmpFilePath, resultHTML, (err: Error) => {
        if (err) {
          alert(`Failed writing a file: ${err}`);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } else {
    try {
      resultHTML = fs.readFileSync(tmpFilePath).toString("utf8");
    } catch (err) {
      alert(`Failed to read file from cached tmp folder: ${err}`);
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: resultHTML,
  };
}
