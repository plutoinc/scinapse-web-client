import * as webpack from 'webpack';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as fs from 'fs';
import { CDN_BASE_HOST, AWS_S3_DEV_FOLDER_PREFIX, APP_DEST } from '../deploy/config';
import { uploadDevFiles } from '../helpers/pushToS3';
const clientConfig = require('../../webpack.dev.browser.config');
const serverConfig = require('../../webpack.dev.server.config');
const handlerConfig = require('../../webpack.dev.handler.config');

const VERSION = new Date().toISOString();

clientConfig.output.publicPath = `${CDN_BASE_HOST}/${AWS_S3_DEV_FOLDER_PREFIX}/${
  process.env.CIRCLE_BRANCH
}/${VERSION}/client/`;

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
  await uploadDevFiles();
  cleanArtifacts();
  fs.writeFileSync(`./${APP_DEST}/version`, VERSION);
}

buildAndUpload()
  .then(() => {
    console.log('DONE');
  })
  .catch(_err => {
    console.log('================================================================================');
    console.log('WARNING!');
    console.log('FAILED TO BUILD SOURCES!');
    console.log('================================================================================');
    process.exit(1);
  });
