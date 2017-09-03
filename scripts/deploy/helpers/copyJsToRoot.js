"use strict";
exports.__esModule = true;
var DeployConfig = require("../config");
var s3 = require("s3");
function copyJsToRoot(NEW_TAG) {
    if (process.env.NODE_ENV === "production") {
        return new Promise(function (resolve, reject) {
            var s3Client = s3.createClient(DeployConfig.S3_CLIENT_OPTIONS);
            var params = {
                Bucket: DeployConfig.AWS_S3_BUCKET,
                CopySource: DeployConfig.AWS_S3_BUCKET + "/" + DeployConfig.AWS_S3_FOLDER_PREFIX + "/" + NEW_TAG + "/bundle.js",
                Key: "bundle.js",
                ACL: "public-read"
            };
            s3Client.copyObject(params, function (err, res) {
                if (err) {
                    console.error("copy to root has failed!", err);
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }
    return new Promise(function (resolve, reject) {
        var s3Client = s3.createClient(DeployConfig.S3_CLIENT_OPTIONS);
        var params = {
            Bucket: DeployConfig.AWS_S3_BUCKET,
            CopySource: DeployConfig.AWS_S3_BUCKET + "/" + DeployConfig.AWS_S3_FOLDER_PREFIX + "/" + NEW_TAG + "/bundle.js",
            Key: "stage/bundle.js",
            ACL: "public-read"
        };
        s3Client.copyObject(params, function (err, _res) {
            if (err) {
                console.error("copy to root has failed!", err);
                reject(err);
            }
            else {
                console.log("Copy object SUCCESS");
                resolve();
            }
        });
    });
}
exports["default"] = copyJsToRoot;
