import * as AWS from 'aws-sdk';
import * as https from 'https';
import fs from 'fs';
// import rimraf from 'rimraf';
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

async function getSources(branch: string, version: string) {
  if (!fs.existsSync(`/tmp/${branch}`)) {
    fs.mkdirSync(`/tmp/${branch}`);
  }

  if (!fs.existsSync(`/tmp/${branch}/${version}`)) {
    fs.mkdirSync(`/tmp/${branch}/${version}`);
    return;
  }

  if (!fs.existsSync(`/tmp/${branch}/${version}/client`)) {
    fs.mkdirSync(`/tmp/${branch}/${version}/client`);
  }
  if (!fs.existsSync(`/tmp/${branch}/${version}/server`)) {
    fs.mkdirSync(`/tmp/${branch}/${version}/server`);
  }

  const prefix = `${DeployConfig.AWS_S3_DEV_FOLDER_PREFIX}/${branch}`;
  console.log('-------------------------------------------------------');
  console.log('LIST S3 FILES');
  const res = await s3
    .listObjectsV2({
      Bucket: DeployConfig.AWS_S3_BUCKET,
      Prefix: prefix,
    })
    .promise();

  console.log('-------------------------------------------------------');
  console.log('DOWNLOAD S3 FILES');
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
          fs.writeFileSync(`/tmp/${branch}/${version}/${filePath}`, objectRes.Body);
        });
    });

    await Promise.all(promiseArr);
  }
}

export const ssr = async (event: LambdaProxy.Event) => {
  const branch = event.queryStringParameters && event.queryStringParameters.branch;
  const version = fs.readFileSync('./version').toString();

  if (!branch) throw new Error('missing branch queryParams flag');
  if (!version) throw new Error('missing version flag');

  console.log(`start to render ${branch} ${version}`);
  await getSources(branch, version);
  const bundle = require(`/tmp/${branch}/${version}/server/main.js`);

  try {
    const res = await bundle.ssr(event);
    return res;
  } catch (err) {
    console.trace(err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
