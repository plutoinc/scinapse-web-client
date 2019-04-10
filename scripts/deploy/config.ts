// S3 Upload Options
interface S3Options {
  region: string;
}

export interface S3ClientOptions {
  maxAsyncS3: number; // this is the default
  s3RetryCount: number; // this is the default
  s3RetryDelay: number; // this is the default
  multipartUploadThreshold: number; // this is the default (20 MB)
  multipartUploadSize: number; // this is the default (15 MB)
  s3Options: S3Options;
}

interface S3Params {
  Bucket: string;
  Prefix: string;
  CacheControl?: string;
}

export interface S3ClientUploaderDownloaderOptions {
  localDir?: string;
  localFile?: string;
  s3Params: S3Params;
  on: Function;
  progressAmount: "string";
  progressTotal: "string";
}

export const S3_CLIENT_OPTIONS: S3ClientOptions = {
  maxAsyncS3: 20, // this is the default
  s3RetryCount: 3, // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    region: "us-east-1",
  },
};

// NOTE: Change below options following your environment
// Local defined Constants
export const DEPLOY_VERSION = process.env.DEPLOY_VERSION;
export const PRODUCTION_GIT_TAG: string = "production";
export const AWS_S3_BUCKET: string = "pluto-web-client";
export const APP_DEST: string = "./dist/";
export const AWS_S3_PRODUCTION_FOLDER_PREFIX: string = "production";
export const AWS_S3_DEV_FOLDER_PREFIX: string = "dev";
export const VERSION_FILE_NAME: string = "version";
export const CDN_BASE_HOST: string = "https://search-bundle.pluto.network";
