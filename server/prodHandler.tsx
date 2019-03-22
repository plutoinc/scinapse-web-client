const awsServerlessExpress = require("aws-serverless-express");
import app from "./index";

const binaryMimeTypes = ["application/xml", "text/xml", "text/html", "application/xml"];
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

export const ssr = (event: any, context: any) => awsServerlessExpress.proxy(server, event, context);
