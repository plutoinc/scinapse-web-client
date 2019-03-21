import * as express from "express";
import ssr from "./ssr";
import { TIMEOUT_FOR_SAFE_RENDERING } from "../app/api/pluto";
import fallbackRender from "./fallbackRender";
import getSitemap from "./routes/sitemap";
import getRobotTxt from "./routes/robots";
import getOpenSearchXML from "./routes/openSearchXML";
import getClientJSURL from "./helpers/getClientJSURL";
const compression = require("compression");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const SITEMAP_REGEX = /^\/sitemap(\/sitemap_[0-9]+\.xml)?\/?$/;

const app = express();
app.use(awsServerlessExpressMiddleware.eventContext({ fromALB: true }));
app.use(compression());
// morgan(':method :url :status :res[content-length] - :response-time ms')

app.get(SITEMAP_REGEX, async (req, res) => {
  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Content-Encoding", "gzip");
  res.setHeader("Access-Contrl-Allow-Origin", "*");
  const sitemap = await getSitemap(req.path);
  res.send(sitemap);
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
  /* ******
  *********  ABOUT SSR *********
  There are 3 kinds of the rendering methods in Scinapse server rendering.
  *********************************************************************************
  ** NAME **** NORMAL RENDERING ** ERROR HANDLING RENDERING ** FALLBACK REDERING **
  *********************************************************************************
  * NORMAL RENDERING
    - CAUSE
      Succeeded to rendering everything.
    - RESULT
      FULL HTML
  * ERROR HANDLING RENDERING
    - CAUSE
      An error occurred during the rendering process.
    - RESULT
      Empty content HTML with <script> tag which contains bundled javascript address for client.
  * FALLBACK RENDERING
    - CAUSE
      Timeout occurred during the rendering process.
    - RESULT
      Empty content HTML with <script> tag which contains bundled javascript address for client.
  ******** */
  try {
    const { jsPath, version } = await getClientJSURL(req.query ? req.query.branch : null);
    const lazyRender = new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(fallbackRender);
      }, TIMEOUT_FOR_SAFE_RENDERING);
    });

    const html = await Promise.race([ssr(req, jsPath, version), lazyRender]);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
});

export default app;
