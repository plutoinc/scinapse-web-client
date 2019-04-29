import * as Cookies from "js-cookie";
import { ABTestType } from "../../constants/abTest";

export function getUserGroupName(testName: ABTestType) {
  return Cookies.get(testName);
}
