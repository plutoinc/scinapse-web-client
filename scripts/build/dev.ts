import * as webpack from "webpack";
import * as path from "path";
import * as rimraf from "rimraf";
import { CDN_BASE_HOST, AWS_S3_DEV_FOLDER_PREFIX } from "../deploy/config";
import { uploadDevClientFiles } from "../helpers/pushToS3";
const clientConfig = require("../../webpack.dev.browser.config");
const serverConfig = require("../../webpack.dev.server.config");
const handlerConfig = require("../../webpack.dev.handler.config");
clientConfig.output.publicPath = `${CDN_BASE_HOST}/${AWS_S3_DEV_FOLDER_PREFIX}/${process.env.BRANCH_NAME}/client/`;

function cleanArtifacts() {
  rimraf.sync(path.resolve(__dirname, "../../dist/client"));
  rimraf.sync(path.resolve(__dirname, "../../dist/server"));
}

async function build() {
  return await new Promise((resolve, reject) => {
    webpack([clientConfig, serverConfig, handlerConfig], async (err, stats) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(stats);
        resolve();
      }
    });
  });
}

(async () => {
  await build();
  await uploadDevClientFiles();
  cleanArtifacts();

  console.log("DONE");
})();
