import { History } from "history";
import { SearchPageQueryParams } from "../../../components/articleSearch/types";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import PapersQueryFormatter, { SearchPageQueryParamsObject } from "../../../helpers/papersQueryFormatter";
import { trackSelectFilter } from "../../../components/filterContainer/trackSelectFilter";

export interface GoToYearFilteredSearchResultPageParams {
  qs: string;
  min: number;
  max: number;
  history: History;
  fromBtn?: boolean;
}

export function goToYearFilteredSearchResultPage({
  qs,
  min,
  max,
  history,
  fromBtn,
}: GoToYearFilteredSearchResultPageParams) {
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

  trackSelectFilter("PUBLISHED_YEAR", JSON.stringify({ min, max, fromBtn: fromBtn || false }));

  history.push({
    pathname: `/search`,
    search: newSearch,
  });
}
