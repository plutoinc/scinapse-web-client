"use strict";
exports.__esModule = true;
var DeployConfig = require("../config");
var s3 = require("s3");
function pushToS3(NEW_TAG) {
    console.log("Start to upload bundled javascript files to S3");
    var s3Client = s3.createClient(DeployConfig.S3_CLIENT_OPTIONS);
    var uploader;
    return new Promise(function (resolve, reject) {
        uploader = s3Client.uploadDir({
            localDir: DeployConfig.APP_DEST,
            s3Params: {
                Bucket: DeployConfig.AWS_S3_BUCKET,
                Prefix: DeployConfig.AWS_S3_FOLDER_PREFIX + "/" + NEW_TAG,
                CacheControl: "public, max-age=604800",
                ACL: "public-read"
            }
        });
        uploader.on("error", function (err) {
            console.error("unable to sync:", err.stack);
            reject(err);
        });
        uploader.on("progress", function () {
            console.log("progress", uploader.progressAmount, uploader.progressTotal);
        });
        uploader.on("end", function () {
            console.log("END to upload dist files to S3");
            resolve();
        });
    })["catch"](function (err) {
        console.error(err);
    });
}
exports["default"] = pushToS3;
