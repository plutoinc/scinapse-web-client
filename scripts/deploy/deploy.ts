import * as fs from "fs";
import pushToS3 from "./helpers/pushToS3";
import copyJsToRoot from "./helpers/copyJsToRoot";

async function deploy() {
  const NEW_TAG: string = new Date().toISOString().replace(/:/g, "-");

  fs.writeFileSync("./version", NEW_TAG);

  await pushToS3(NEW_TAG);
  await copyJsToRoot(NEW_TAG);
}

deploy().then(() => {
  console.log("DONE!");
});
