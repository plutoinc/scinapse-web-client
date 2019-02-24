import { History } from "history";
import { SearchPageQueryParams } from "../../../components/articleSearch/types";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import PapersQueryFormatter, { SearchPageQueryParamsObject } from "../../../helpers/papersQueryFormatter";
interface GoToYearFilteredSearchResultPageParams {
  qs: string;
  min: number;
  max: number;
  history: History;
}

export function goToYearFilteredSearchResultPage({ qs, min, max, history }: GoToYearFilteredSearchResultPageParams) {
  const qp: SearchPageQueryParams = getQueryParamsObject(qs);
  const filter = PapersQueryFormatter.objectifyPapersFilter(qp.filter);
  const newFilter = { ...filter, yearFrom: min, yearTo: max };
  const newQP: SearchPageQueryParamsObject = {
    query: qp.query || "",
    filter: newFilter,
    page: parseInt(qp.page || "1", 10),
    sort: qp.sort || "RELEVANCE",
  };
  const newSearch = PapersQueryFormatter.stringifyPapersQuery(newQP);
  history.push({
    pathname: `/search`,
    search: newSearch,
  });
}
