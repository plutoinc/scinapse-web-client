import { Location } from 'history';
import PapersQueryFormatter, { FilterObject, SearchPageQueryParamsObject } from './searchQueryManager';
import getQueryParamsObject from './getQueryParamsObject';
import SafeURIStringHandler from './safeURIStringHandler';

export function getUrlDecodedQueryParamsObject(location: Location): SearchPageQueryParamsObject {
  const rawQueryParamsObj: Scinapse.ArticleSearch.RawQueryParams = getQueryParamsObject(location.search);

  return {
    query: SafeURIStringHandler.decode(rawQueryParamsObj.query),
    page: parseInt(rawQueryParamsObj.page, 10),
    filter: PapersQueryFormatter.objectifyPaperFilter(rawQueryParamsObj.filter),
    sort: rawQueryParamsObj.sort,
  };
}

export default function makeNewFilterLink(newFilter: Partial<FilterObject>, location: Location) {
  const queryParamsObject = getUrlDecodedQueryParamsObject(location);

  return `/search?${PapersQueryFormatter.stringifyPapersQuery({
    query: queryParamsObject.query,
    page: 1,
    sort: queryParamsObject.sort,
    filter: { ...queryParamsObject.filter, ...newFilter },
  })}`;
}
