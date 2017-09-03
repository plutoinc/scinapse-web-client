"use strict";
exports.__esModule = true;
exports.S3_CLIENT_OPTIONS = {
    maxAsyncS3: 20,
    s3RetryCount: 3,
    s3RetryDelay: 1000,
    multipartUploadThreshold: 20971520,
    multipartUploadSize: 15728640,
    s3Options: {
        region: "us-east-1"
    }
};
// NOTE: Change below options following your environment
// Local defined Constants
exports.DEPLOY_VERSION = process.env.DEPLOY_VERSION;
exports.PRODUCTION_GIT_TAG = "production";
exports.AWS_S3_BUCKET = "pluto-web-client";
exports.APP_DEST = "./dist/";
exports.AWS_S3_FOLDER_PREFIX = "react-app";
exports.VERSION_FILE_NAME = "version";
