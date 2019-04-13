import * as express from "express";
import { LIVE_TESTS } from "../../app/constants/abTest";

export default function setABTest(req: express.Request, res: express.Response) {
  if (req.cookies) {
    const keys = Object.keys(req.cookies);

    LIVE_TESTS.forEach(test => {
      if (!keys.includes(test.name)) {
        let userGroup = "";
        const randomValue = Math.random();
        test.userGroup.reduce((accm, cv) => {
          if (randomValue >= accm && randomValue < accm + cv.weight) {
            userGroup = cv.groupName;
          }
          return accm + cv.weight;
        }, 0);

        res.cookie(test.name, userGroup, {
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
