import { parse } from "qs";

export default function getQueryParamsObject(queryParams?: string | object) {
  if (typeof queryParams === "object") {
    return queryParams;
  } else if (typeof queryParams === "string") {
    return parse(queryParams, { ignoreQueryPrefix: true });
  } else {
    return null;
  }
}
