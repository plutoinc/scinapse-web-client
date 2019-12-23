import * as AWS from 'aws-sdk';
import * as webpack from 'webpack';
import * as path from 'path';
import * as rimraf from 'rimraf';
import { BUNDLE_BASE_PATH, AWS_S3_DEV_FOLDER_PREFIX, AWS_SSM_PARAM_STORE_NAME } from '../deploy/config';
import { uploadDevFiles } from '../helpers/pushToS3';
const clientConfig = require('../../webpack.dev.browser.config');
const serverConfig = require('../../webpack.dev.server.config');
const handlerConfig = require('../../webpack.dev.handler.config');

const VERSION = new Date().toISOString();
const escapedBranch = process.env.CIRCLE_BRANCH.replace('/', '-');
clientConfig.output.publicPath = `${BUNDLE_BASE_PATH}/${AWS_S3_DEV_FOLDER_PREFIX}/${
  process.env.CIRCLE_BRANCH
}/${VERSION}/client/`;

const ssm = new AWS.SSM({ region: 'us-east-1' });

function cleanArtifacts() {
  rimraf.sync(path.resolve(__dirname, '../../dist/client'));
  rimraf.sync(path.resolve(__dirname, '../../dist/server'));
}

function build() {
  return new Promise((resolve, reject) => {
    webpack([clientConfig, serverConfig, handlerConfig], async (err, stats) => {
      if (err || stats.hasErrors()) {
        process.stdout.write(stats.toString() + '\n');
        reject();
      } else {
        console.log(stats);
        resolve();
      }
    });
  });
}

async function buildAndUpload() {
  await build();
  await uploadDevFiles(VERSION);

  const globalParams = await ssm
    .getParameter({
      Name: AWS_SSM_PARAM_STORE_NAME,
    })
    .promise();

  if (!globalParams.Parameter) throw new Error('No global parameters exist in AWS-SSM');

  const currentBranchVersionString = globalParams.Parameter.Value;
  const branchMap = JSON.parse(currentBranchVersionString);
  const updatedBranchMap = { ...branchMap, [escapedBranch]: VERSION };
  await ssm
    .putParameter({
      Name: AWS_SSM_PARAM_STORE_NAME,
      Value: JSON.stringify(updatedBranchMap),
      Type: 'String',
      Overwrite: true,
    })
    .promise();
  cleanArtifacts();
}

buildAndUpload()
  .then(() => {
    console.log('DONE');
  })
  .catch(err => {
    console.log('================================================================================');
    console.log(err);
    console.log('WARNING!');
    console.log('FAILED TO BUILD SOURCES!');
    console.log('================================================================================');
    process.exit(1);
  });
