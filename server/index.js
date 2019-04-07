"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var express = require("express");
var fs = require("fs");
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var path = require("path");
var ssr_1 = require("./ssr");
var sitemap_1 = require("./routes/sitemap");
var robots_1 = require("./routes/robots");
var openSearchXML_1 = require("./routes/openSearchXML");
var setABTest_1 = require("./helpers/setABTest");
var compression = require("compression");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
var SITEMAP_REGEX = /^\/sitemap(\/sitemap_[0-9]+\.xml)?\/?$/;
var app = express();
app.disable("x-powered-by");
app.use(awsServerlessExpressMiddleware.eventContext({ fromALB: true }));
app.use(cookieParser());
app.use(compression({ filter: shouldCompress }));
app.use(morgan("combined"));
function shouldCompress(req, res) {
    if (SITEMAP_REGEX.test(req.path))
        return false;
    return compression.filter(req, res);
}
app.get(SITEMAP_REGEX, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var sitemap;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                res.setHeader("Content-Encoding", "gzip");
                res.setHeader("Content-Type", "text/xml");
                res.setHeader("Access-Contrl-Allow-Origin", "*");
                return [4 /*yield*/, sitemap_1["default"](req.path)];
            case 1:
                sitemap = _a.sent();
                res.send(sitemap.body);
                return [2 /*return*/];
        }
    });
}); });
app.get("/robots.txt", function (req, res) {
    res.setHeader("Cache-Control", "max-age=100");
    res.setHeader("Content-Type", "text/plain");
    var body = robots_1["default"](req.headers.host === "scinapse.io");
    res.send(body);
});
app.get("/opensearch.xml", function (_req, res) {
    var body = openSearchXML_1["default"]();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.send(body);
});
app.get("*", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var version, html, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                version = "";
                if (process.env.NODE_ENV === "production") {
                    version = fs.readFileSync(path.resolve(__dirname, "./version")).toString("utf8");
                }
                setABTest_1["default"](req, res);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ssr_1["default"](req, version)];
            case 2:
                html = _a.sent();
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                res.send(html);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1);
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                // TODO: make error page
                res.send("<h1>Something went wrong.</h1>");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports["default"] = app;
