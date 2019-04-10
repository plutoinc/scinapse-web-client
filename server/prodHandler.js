"use strict";
exports.__esModule = true;
var index_1 = require("./index");
var awsServerlessExpress = require("aws-serverless-express");
var binaryMimeTypes = ["application/xml", "text/xml", "text/html", "application/xml"];
var server = awsServerlessExpress.createServer(index_1["default"], null, binaryMimeTypes);
exports.ssr = function (event, context) { return awsServerlessExpress.proxy(server, event, context); };
