import * as fs from "fs";
import pushToS3 from "./helpers/pushToS3";
import { setTimeout } from "timers";

async function deploy() {
  const NEW_TAG: string = new Date().toISOString().replace(/:/g, "-");

  fs.writeFileSync("./version", NEW_TAG);

  console.log(`THE CURRENT VERSION IS === ${NEW_TAG}`);

  await pushToS3(NEW_TAG);
  await new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
}

deploy().then(() => {
  console.log("DONE!");
});
