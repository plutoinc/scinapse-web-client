import app from "./index";
const awsServerlessExpress = require("aws-serverless-express");

const binaryMimeTypes = [
  "application/xml",
  "text/xml",
  "text/html",
  "application/xml",
  "text/javascript",
  "application/javascript",
  "application/json",
];
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

export const ssr = (event: any, context: any) => awsServerlessExpress.proxy(server, event, context);
