import * as Cookies from "js-cookie";
import { ABTestType } from "../../constants/abTest";

export function getUserGroupName(testName: ABTestType) {
  const getRandomUserName = Cookies.get(testName);
  return getRandomUserName;
}
