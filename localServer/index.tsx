// tslint:disable-next-line:no-implicit-dependencies
import * as express from "express";
import { serverSideRender, renderJavaScriptOnly } from "../app/server";

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

    return resultHTML;
  };

  const safeTimeout = new Promise((resolve, _reject) => {
    const jsOnlyHTML = renderJavaScriptOnly("http://localhost:8080/bundle.js");
    setTimeout(
      () => {
        console.log("============== SAFE RENDERING FIRED! ==============");
        resolve(jsOnlyHTML);
      },
      5000,
      jsOnlyHTML,
    );
  });

  const html = await Promise.race([normalRender(), safeTimeout]);
  console.log("========== Just before to send HTML string");
  res.send(html);
});

const port: number = Number(process.env.PORT) || 3000;

server
  .listen(port, () => console.log(`Express server listening at ${port}! Visit https://localhost:${port}`))
  .on("error", err => console.error("LOCAL_SERVER_ERROR =======================", err));
