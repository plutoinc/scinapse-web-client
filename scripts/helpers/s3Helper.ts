import MemCache, { MemCacheOption } from "./memCache";
import * as AWS from "aws-sdk";

export default class S3Helper {
  private storage: MemCache;
  private s3Client: AWS.S3;

  constructor() {
    this.storage = new MemCache();
    this.s3Client = new AWS.S3();
  }

  public async getRemoteFile(bucket: string, key: string) {
    return new Promise<string>((resolve, reject) => {
      const startTime = new Date();

      this.s3Client.getObject(
        {
          Bucket: bucket,
          Key: key,
        },
        (err: Error, data: any) => {
          if (err) {
            console.error(`S3 fetch error. version: ${key}, error: ${err}`);
            reject(err);
          } else {
            console.log(`Fetching ${bucket}/${key} took ${new Date().getTime() - startTime.getTime()}`);
            resolve(data.Body.toString("utf8"));
          }
        },
      );
    });
  }

  public async getFile(bucket: string, key: string, cacheOption: MemCacheOption | null) {
    let resultString: string;

    if (cacheOption) {
      resultString = await this.storage.fetch(key, cacheOption, () => this.getRemoteFile(bucket, key));
    } else {
      // Doesn't Apply Cache
      resultString = await this.getRemoteFile(bucket, key);
    }

    return resultString.replace("<html>", `<html date=${new Date().toISOString()}>`);
  }
}
