import * as express from "express";
import * as morgan from "morgan";
import * as cookieParser from "cookie-parser";
import ssr from "./ssr";
import { TIMEOUT_FOR_SAFE_RENDERING } from "../app/api/pluto";
import fallbackRender from "./fallbackRender";
import getSitemap from "./routes/sitemap";
import getRobotTxt from "./routes/robots";
import getOpenSearchXML from "./routes/openSearchXML";
import getVersion from "./helpers/getClientJSURL";
import setABTest from "./helpers/setABTest";
const compression = require("compression");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const SITEMAP_REGEX = /^\/sitemap(\/sitemap_[0-9]+\.xml)?\/?$/;

const app = express();
app.disable("x-powered-by");
app.use(awsServerlessExpressMiddleware.eventContext({ fromALB: true }));
app.use(cookieParser());
app.use(compression({ filter: shouldCompress }));
app.use(morgan("combined"));

function shouldCompress(req: express.Request, res: express.Response) {
  if (SITEMAP_REGEX.test(req.path)) return false;
  return compression.filter(req, res);
}

app.get(SITEMAP_REGEX, async (req, res) => {
  res.setHeader("Content-Encoding", "gzip");
  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Access-Contrl-Allow-Origin", "*");
  const sitemap = await getSitemap(req.path);
  res.send(sitemap.body);
});

app.get("/robots.txt", (req, res) => {
  res.setHeader("Cache-Control", "max-age=100");
  res.setHeader("Content-Type", "text/plain");
  const body = getRobotTxt(req.headers.host === "scinapse.io");
  res.send(body);
});

app.get("/opensearch.xml", (_req, res) => {
  const body = getOpenSearchXML();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.send(body);
});

app.get("*", async (req, res) => {
  const { jsPath, version } = await getVersion(req.query ? req.query.branch : null);

  setABTest(req, res);

  try {
    const lazyRender = new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(fallbackRender(jsPath, version));
      }, TIMEOUT_FOR_SAFE_RENDERING);
    });

    const html = await Promise.race([ssr(req, version), lazyRender]);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error(err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(fallbackRender(jsPath, version));
  }
});

export default app;
