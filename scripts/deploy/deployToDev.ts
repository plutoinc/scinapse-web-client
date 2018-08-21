import * as fs from "fs";
import pushToS3 from "./helpers/pushToS3";

async function deploy() {
  const NEW_TAG: string = new Date().toISOString().replace(/:/g, "-");

  fs.writeFileSync("./version", NEW_TAG);

  console.log(`THE CURRENT VERSION IS === ${NEW_TAG}`);

  await pushToS3(NEW_TAG);
}

deploy().then(() => {
  console.log("DONE!");
});
