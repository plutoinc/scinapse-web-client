import { parse } from "qs";

export default function getQueryParamsObject(queryParams?: string | object) {
  console.log(queryParams, "====================================== inside of the getQueryParamsObject");
  if (typeof queryParams === "string") {
    return parse(queryParams, { ignoreQueryPrefix: true });
  }
  return queryParams;
}
