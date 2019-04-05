import { parse } from "qs";

export default function getQueryParamsObject(queryParams?: string | object) {
  if (typeof queryParams === "string") {
    return parse(queryParams, { ignoreQueryPrefix: true });
  }
  return queryParams;
}
