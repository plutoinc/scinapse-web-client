import { Paper } from '../../../model/paper';

export interface ArticleSearchContainerProps {
  search: Paper[];
}

export interface SearchPageQueryParams {
  query?: string;
  filter?: string;
  page?: string;
  sort?: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS;
}
