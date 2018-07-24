import * as fs from "fs";
import downloadBundleFromS3 from "./helpers/downloadBundle";
import { setTimeout } from "timers";

async function deploy() {
  const VERSION = process.env.VERSION;
  fs.writeFileSync("./version", VERSION);
  console.log(`THE CURRENT VERSION IS === ${VERSION}`);

  await downloadBundleFromS3(VERSION);
  await new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
}

deploy().then(() => {
  console.log("DONE!");
});
