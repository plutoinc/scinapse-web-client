// tslint:disable-next-line:no-implicit-dependencies
import * as express from "express";
import { serverSideRender, renderJavaScriptOnly, SSRResult } from "../app/server";
import { TIMEOUT_FOR_SAFE_RENDERING } from "../app/api/pluto";
var cookieParser = require("cookie-parser");

const server = express();
(global as any).navigator = { userAgent: "all" };
server.use(cookieParser());

console.log("START SERVER");

server.disable("x-powered-by").all("/*", async (req: express.Request, res: express.Response) => {
  let succeededToServerRendering = false;
  console.log(`Get request for ${req.method} :  ${req.url}`);

  if (req.method !== "GET") {
    return res.send("Nice Try");
  }

  const normalRender = async (): Promise<SSRResult> => {
    const ssrResult = await serverSideRender({
      requestPath: req.url,
      scriptVersion: "http://localhost:8080/bundle.js",
      headers: req.headers,
    });
    succeededToServerRendering = true;

    const buf = new Buffer(ssrResult.html);
    if (buf.byteLength > 1048576 /* 6MB */) {
      throw new Error("HTML SIZE IS OVER LAMBDA LIMITATION");
    }

    if (!succeededToServerRendering) {
      console.log("============== NORMAL RENDERING FIRED! ============== ");
    }

    return ssrResult;
  };

  const safeTimeout: Promise<SSRResult> = new Promise((resolve, _reject) => {
    const jsOnlyHTML = renderJavaScriptOnly("http://localhost:8080/bundle.js", "");
    setTimeout(
      () => {
        if (!succeededToServerRendering) {
          console.log("============== FALLBACK RENDERING FIRED! ==============");
        }
        succeededToServerRendering = false;
        resolve({
          html: jsOnlyHTML,
        });
      },
      TIMEOUT_FOR_SAFE_RENDERING,
      jsOnlyHTML
    );
  });

  return Promise.race([normalRender(), safeTimeout])
    .then(ssrResult => {
      res.status(ssrResult.statusCode || 200).send(ssrResult.html);
    })
    .catch(err => {
      console.log(err);
      console.log("============== ERROR HADNLING RENDERING FIRED! ==============");
      res.send(renderJavaScriptOnly("http://localhost:8080/bundle.js", ""));
    });
});

const port: number = Number(process.env.PORT) || 3000;

server
  .listen(port, () => console.log(`Express server listening at ${port}! Visit https://localhost:${port}`))
  .on("error", err => console.error("LOCAL_SERVER_ERROR =======================", err));
