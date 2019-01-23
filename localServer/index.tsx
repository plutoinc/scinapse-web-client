// tslint:disable-next-line:no-implicit-dependencies
import * as express from "express";
import { serverSideRender, renderJavaScriptOnly } from "../app/server";
import { TIMEOUT_FOR_SAFE_RENDERING } from "../app/api/pluto";

const server = express();
(global as any).navigator = { userAgent: "all" };

console.log("START SERVER");

server.disable("x-powered-by").all("/*", async (req: express.Request, res: express.Response) => {
  let succeededToServerRendering = false;
  console.log(`Get request for ${req.method} :  ${req.url}`);

  if (req.method !== "GET") {
    return res.send("Nice Try");
  }

  const normalRender = async () => {
    const resultHTML = await serverSideRender({
      requestUrl: req.url,
      scriptVersion: "http://localhost:8080/bundle.js",
      userAgent: req.headers["User-Agent"] || req.headers["user-agent"],
      xForwardedFor: req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"],
    });
    succeededToServerRendering = true;

    const buf = new Buffer(resultHTML);
    if (buf.byteLength > 6291456 /* 6MB */) {
      throw new Error("HTML SIZE IS OVER LAMBDA LIMITATION");
    }

    if (!succeededToServerRendering) {
      console.log("============== NORMAL RENDERING FIRED! ============== ");
    }

    return resultHTML;
  };

  const safeTimeout = new Promise((resolve, _reject) => {
    const jsOnlyHTML = renderJavaScriptOnly("http://localhost:8080/bundle.js", "");
    setTimeout(
      () => {
        if (!succeededToServerRendering) {
          console.log("============== FALLBACK RENDERING FIRED! ==============");
        }
        succeededToServerRendering = false;
        resolve(jsOnlyHTML);
      },
      TIMEOUT_FOR_SAFE_RENDERING,
      jsOnlyHTML
    );
  });

  return Promise.race([normalRender(), safeTimeout])
    .then(html => {
      res.send(html);
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
