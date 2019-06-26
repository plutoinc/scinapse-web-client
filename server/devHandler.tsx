import * as AWS from 'aws-sdk';
import * as https from 'https';
import fs from 'fs';
import rimraf from 'rimraf';
import * as DeployConfig from '../scripts/deploy/config';

const s3 = new AWS.S3();

AWS.config.update({
  region: 'us-east-1',
  httpOptions: {
    agent: new https.Agent({
      keepAlive: true,
    }),
  },
});

let isDownloading = false;

async function downloadSrcFromS3(branch?: string) {
  isDownloading = true;
  console.log('-------------------------------------------------------');
  console.log('REMOVE OLD TMP DIRECTORY');
  rimraf.sync('/tmp/*');

  if (!fs.existsSync('/tmp/client')) {
    fs.mkdirSync('/tmp/client');
  }

  if (!fs.existsSync('/tmp/server')) {
    fs.mkdirSync('/tmp/server');
  }

  const prefix = branch
    ? `${DeployConfig.AWS_S3_DEV_FOLDER_PREFIX}/${branch}`
    : DeployConfig.AWS_S3_PRODUCTION_FOLDER_PREFIX;

  console.log('-------------------------------------------------------');
  console.log('LIST FILES');
  const res = await s3
    .listObjectsV2({
      Bucket: DeployConfig.AWS_S3_BUCKET,
      Prefix: prefix,
    })
    .promise();

  console.log('-------------------------------------------------------');
  console.log('DOWNLOAD FILES');
  if (res.Contents && res.Contents.length > 0) {
    const promiseArr = res.Contents.map(content => {
      const params: AWS.S3.Types.GetObjectRequest = {
        Bucket: DeployConfig.AWS_S3_BUCKET,
        Key: content.Key!,
      };

      return s3
        .getObject(params)
        .promise()
        .then(objectRes => {
          const pwdArr = content.Key!.split('/');
          let filePath = pwdArr[pwdArr.length - 2] + '/' + pwdArr[pwdArr.length - 1];
          if (pwdArr[pwdArr.length - 2] !== 'client' && pwdArr[pwdArr.length - 2] !== 'server') {
            filePath = pwdArr[pwdArr.length - 1];
          }
          fs.writeFileSync(`/tmp/${filePath}`, objectRes.Body);
        });
    });

    await Promise.all(promiseArr);
  }
  isDownloading = false;
}

export const ssr = async (event: LambdaProxy.Event) => {
  const branch = event.queryStringParameters && event.queryStringParameters.branch;

  if (event.path.includes('sw.js') || event.path.includes('favicon')) {
    return {
      statusCode: 200,
      body: '',
    };
  }

  if (!isDownloading && !fs.existsSync('/tmp/server/main.js')) {
    await downloadSrcFromS3(branch);
  }

  const bundle = require('/tmp/server/main.js');
  (global as any).__webpack_public_path__ = '/tmp/server';

  try {
    const res = await bundle.ssr(event);
    return res;
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
