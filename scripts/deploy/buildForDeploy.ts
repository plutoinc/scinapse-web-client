import * as fs from "fs";
import downloadBundleFromS3 from "./helpers/downloadBundle";
import { APP_DEST } from "./config";

async function deploy() {
  const VERSION = process.env.VERSION;

  if (!fs.existsSync(APP_DEST)) {
    fs.mkdirSync(APP_DEST);
  }

  fs.writeFileSync("./version", VERSION);
  console.log(`THE CURRENT VERSION IS === ${VERSION}`);

  await downloadBundleFromS3(VERSION);
}

deploy().then(() => {
  console.log("DONE!");
});
