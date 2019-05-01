import * as express from "express";
import { getRandomUserGroup, LIVE_TESTS } from "../../app/constants/abTest";

export default function setABTest(req: express.Request, res: express.Response) {
  if (req.cookies) {
    const keys = Object.keys(req.cookies);

    LIVE_TESTS.forEach(test => {
      if (!keys.includes(test.name)) {
        const randomUserGroup = getRandomUserGroup(test.name);
        res.cookie(test.name, randomUserGroup, {
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
