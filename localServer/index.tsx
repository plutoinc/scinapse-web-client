// tslint:disable-next-line:no-implicit-dependencies
import * as express from "express";
import { serverSideRender, renderJavaScriptOnly } from "../app/server";
import { TIMEOUT_FOR_SAFE_RENDERING } from "../app/api/pluto";

const server = express();
(global as any).navigator = { userAgent: "all" };

console.log("START SERVER");

server.disable("x-powered-by").get("/*", async (req: express.Request, res: express.Response) => {
  console.log(`Get request for ${req.url}`);

  const mockUserAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36";

  const normalRender = async () => {
    const resultHTML = await serverSideRender({
      requestUrl: req.url,
      scriptPath: "http://localhost:8080/bundle.js",
      userAgent: mockUserAgent,
    });
    console.log("============== NORMAL SERVER SIDE RENDERING FIRED! ============== ");
    const buf = new Buffer(resultHTML);
    if (buf.byteLength > 6291456 /* 6MB */) {
      throw new Error("HTML SIZE IS OVER LAMBDA LIMITATION");
    }
    return resultHTML;
  };

  const safeTimeout = new Promise((resolve, _reject) => {
    const jsOnlyHTML = renderJavaScriptOnly("http://localhost:8080/bundle.js");
    setTimeout(
      () => {
        console.log("============== SAFE RENDERING FIRED! ==============");
        resolve(jsOnlyHTML);
      },
      TIMEOUT_FOR_SAFE_RENDERING,
      jsOnlyHTML,
    );
  });

  Promise.race([normalRender(), safeTimeout])
    .then(html => {
      console.log("========== Just before to send HTML string");
      res.send(html);
    })
    .catch(err => {
      console.error(err);
      res.send(renderJavaScriptOnly("http://localhost:8080/bundle.js"));
    });
});

const port: number = Number(process.env.PORT) || 3000;

server
  .listen(port, () => console.log(`Express server listening at ${port}! Visit https://localhost:${port}`))
  .on("error", err => console.error("LOCAL_SERVER_ERROR =======================", err));
