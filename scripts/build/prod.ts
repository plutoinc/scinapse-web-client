import * as webpack from "webpack";
import * as path from "path";
import * as fs from "fs";
import { CDN_BASE_HOST, AWS_S3_PRODUCTION_FOLDER_PREFIX } from "../deploy/config";
import { uploadProdFiles } from "../helpers/pushToS3";
const clientConfig = require("../../webpack.prod.browser.config");
const serverConfig = require("../../webpack.prod.server.config");
const version = new Date().toISOString().replace(/:/g, "-");
clientConfig.output.publicPath = `${CDN_BASE_HOST}/${AWS_S3_PRODUCTION_FOLDER_PREFIX}/client/`;

console.log("version is ", version);

function cleanArtifacts() {
  const fileList = fs.readdirSync(path.resolve(__dirname, "../../dist/client"));
  fileList.map(filename => {
    if (!filename.includes("json")) {
      const targetPath = path.resolve(__dirname, "../../dist/client", filename);
      fs.unlinkSync(targetPath);
    }
  });
}

function build() {
  return new Promise((resolve, reject) => {
    webpack([clientConfig, serverConfig], (err, stats) => {
      if (err || stats.hasErrors()) {
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
  await uploadProdFiles();
  cleanArtifacts();
  fs.writeFileSync(path.resolve(__dirname, "../../dist/server/version"), version);
  fs.writeFileSync("./version", version);

  console.log("DONE");
})();
