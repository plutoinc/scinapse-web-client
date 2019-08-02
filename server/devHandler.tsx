import * as AWS from 'aws-sdk';
import * as https from 'https';
import fs from 'fs';
import * as DeployConfig from '../scripts/deploy/config';
import { AWS_SSM_PARAM_STORE_NAME } from '../scripts/deploy/config';

const s3 = new AWS.S3();
const ssm = new AWS.SSM({ region: 'us-east-1' });

AWS.config.update({
  region: 'us-east-1',
  httpOptions: {
    agent: new https.Agent({
      keepAlive: true,
    }),
  },
});

async function getSources(branch: string, version: string, escapedBranch: string) {
  if (fs.existsSync(`/tmp/${escapedBranch}/${version}`)) return;

  if (!fs.existsSync(`/tmp/${escapedBranch}`)) {
    fs.mkdirSync(`/tmp/${escapedBranch}`);
  }

  if (!fs.existsSync(`/tmp/${escapedBranch}/${version}`)) {
    fs.mkdirSync(`/tmp/${escapedBranch}/${version}`);
  }

  if (!fs.existsSync(`/tmp/${escapedBranch}/${version}/client`)) {
    fs.mkdirSync(`/tmp/${escapedBranch}/${version}/client`);
  }
  if (!fs.existsSync(`/tmp/${escapedBranch}/${version}/server`)) {
    fs.mkdirSync(`/tmp/${escapedBranch}/${version}/server`);
  }

  const prefix = `${DeployConfig.AWS_S3_DEV_FOLDER_PREFIX}/${branch}`;
  const res = await s3
    .listObjectsV2({
      Bucket: DeployConfig.AWS_S3_BUCKET,
      Prefix: prefix,
    })
    .promise();

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
          fs.writeFileSync(`/tmp/${escapedBranch}/${version}/${filePath}`, objectRes.Body);
        });
    });

    await Promise.all(promiseArr);
  }
}

export const ssr = async (event: LambdaProxy.Event) => {
  const branch = event.queryStringParameters && event.queryStringParameters.branch;
  if (!branch) throw new Error('missing branch queryParams flag');

  // NOTE: If branch name isn't escaped, it can be treated as path
  const escapedBranch = branch.replace('/', '-');
  const globalParams = await ssm
    .getParameter({
      Name: AWS_SSM_PARAM_STORE_NAME,
    })
    .promise();

  if (!globalParams.Parameter || !globalParams.Parameter.Value) {
    throw new Error('No global parameters exist in AWS-SSM');
  }
  const currentBranchVersionString = globalParams.Parameter.Value;
  const branchMap = JSON.parse(currentBranchVersionString);

  const version = branchMap[escapedBranch];

  if (!version) throw new Error('missing version flag');

  console.log(`start to render ${branch} ${version}`);

  await getSources(branch, version, escapedBranch);
  const bundle: any = __non_webpack_require__(`/tmp/${escapedBranch}/${version}/server/main.js`);

  try {
    const res = await bundle.ssr(event);
    return res;
  } catch (err) {
    console.log(err);
    console.error(err);
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
