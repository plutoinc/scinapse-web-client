import { History } from 'history';
import { SearchPageQueryParams } from '../articleSearch/types';
import getQueryParamsObject from '../../helpers/getQueryParamsObject';
import PapersQueryFormatter, { SearchPageQueryParamsObject } from '../../helpers/searchQueryManager';
import { trackSelectFilter } from '../../helpers/trackSelectFilter';

export interface GoToYearFilteredSearchResultPageParams {
  qs: string;
  min: number | string;
  max: number | string;
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
  if (typeof min === 'string' && min.length > 0) return;
  if (typeof max === 'string' && max.length > 0) return;

  const qp: SearchPageQueryParams = getQueryParamsObject(qs);
  const filter = PapersQueryFormatter.objectifyPaperFilter(qp.filter);
  const newFilter = { ...filter, yearFrom: min, yearTo: max };
  const newQP: SearchPageQueryParamsObject = {
    query: qp.query || '',
    filter: newFilter,
    page: parseInt(qp.page || '1', 10),
    sort: qp.sort || 'RELEVANCE',
  };
  const newSearch = PapersQueryFormatter.stringifyPapersQuery(newQP);

  trackSelectFilter('PUBLISHED_YEAR', JSON.stringify({ min, max, fromBtn: fromBtn || false }));

  history.push({
    pathname: `/search`,
    search: newSearch,
  });
}
