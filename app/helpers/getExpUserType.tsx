import * as Cookie from "cookie";

export const USER_EXPERIMENT_TYPE_KEY = "u_t";

export default function getExpUserType(cookieStr: string): string {
  const cookie = Cookie.parse(cookieStr);

  if (!cookie[USER_EXPERIMENT_TYPE_KEY]) {
    const type = Math.random() < 0.5 ? "A" : "B";
    return type;
  } else {
    return cookie[USER_EXPERIMENT_TYPE_KEY];
  }
}
