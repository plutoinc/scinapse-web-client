// tslint:disable-next-line:no-implicit-dependencies
import * as express from "express";
import { serverSideRender } from "../app/server";

const server = express();

console.log("START SERVER");
server.disable("x-powered-by").get("/*", async (req: express.Request, res: express.Response) => {
  const rendered = await serverSideRender(req.url, "http://localhost:8080/bundle.js");
  res.send(rendered);
});

const port: number = Number(process.env.PORT) || 3000;

server.listen(port, () => console.log(`Express server listening at ${port}`)).on("error", err => console.error(err));
