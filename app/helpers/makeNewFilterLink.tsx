import PapersQueryFormatter, { FilterObject, SearchPageQueryParamsObject } from "./papersQueryFormatter";
import getQueryParamsObject from "./getQueryParamsObject";
import SafeURIStringHandler from "./safeURIStringHandler";

export function getUrlDecodedQueryParamsObject(): SearchPageQueryParamsObject {
  const rawQueryParamsObj: Scinapse.ArticleSearch.RawQueryParams = getQueryParamsObject(window.location.search);

  return {
    query: SafeURIStringHandler.decode(rawQueryParamsObj.query),
    page: parseInt(rawQueryParamsObj.page, 10),
    filter: PapersQueryFormatter.objectifyPapersFilter(rawQueryParamsObj.filter),
    sort: rawQueryParamsObj.sort,
  };
}

export default function makeNewFilterLink(newFilter: FilterObject) {
  const queryParamsObject = getUrlDecodedQueryParamsObject();

  return `/search?${PapersQueryFormatter.stringifyPapersQuery({
    query: queryParamsObject.query,
    page: 1,
    sort: queryParamsObject.sort,
    filter: { ...queryParamsObject.filter, ...newFilter },
  })}`;
}
