import * as express from "express";
import { LIVE_TESTS } from "../../app/constants/abTest";

export default function setABTest(req: express.Request, res: express.Response) {
  if (req.cookies) {
    const keys = Object.keys(req.cookies);

    LIVE_TESTS.forEach(test => {
      if (!keys.includes(test.name)) {
        const result = Math.random() < test.weight ? "A" : "B";
        res.cookie(test.name, result, {
          maxAge: 31536000000,
        });
      } else {
        res.cookie(test.name, req.cookies[test.name], {
          maxAge: 31536000000,
        });
      }
    });
  }
}
