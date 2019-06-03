import { Author } from '../../model/author/author';

export interface AuthorSearchState
  extends Readonly<{
      sort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS;
      isLoading: boolean;
      pageErrorCode: number | null;
      searchInput: string;
      page: number;
      numberOfElements: number;
      totalElements: number;
      totalPages: number;
      isFirst: boolean;
      isEnd: boolean;
      searchItemsToShow: Author[];
    }> {}

export const AUTHOR_SEARCH_INITIAL_STATE: AuthorSearchState = {
  sort: 'RELEVANCE',
  isLoading: false,
  pageErrorCode: null,
  searchInput: '',
  page: 1,
  numberOfElements: 0,
  totalElements: 0,
  totalPages: 0,
  isFirst: true,
  isEnd: false,
  searchItemsToShow: [],
};
