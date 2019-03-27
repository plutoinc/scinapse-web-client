import * as Cookie from "cookie";
import EnvChecker from "./envChecker";

export default function getABType(targetKey: string): string {
  if (!EnvChecker.isOnServer()) {
    const cookie = Cookie.parse(document.cookie);
    return cookie[targetKey];
  }
  // A is always a default value
  return "A";
}
