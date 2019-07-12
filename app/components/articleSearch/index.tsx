import * as React from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { parse } from 'qs';
import NoSsr from '@material-ui/core/NoSsr';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import { withStyles } from '../../helpers/withStylesHelper';
import SearchQueryManager, { FilterObject } from '../../helpers/searchQueryManager';
import { AppState } from '../../reducers';
import NoResult from './components/noResult';
import NoResultInSearch from './components/noResultInSearch';
import TabNavigationBar from '../common/tabNavigationBar';
import Suggestions from './components/suggestions';
import ErrorPage from '../error/errorPage';
import { searchPapers } from './actions';
import SearchList from './components/searchList';
import DoiSearchBlocked from './components/doiSearchBlocked';
import { Paper } from '../../model/paper';
import AuthorSearchItem from '../authorSearchItem';
import { Actions } from '../../actions/actionTypes';
import restoreScroll from '../../helpers/scrollRestoration';
import { SearchPageQueryParams } from './types';
import { MatchAuthor } from '../../api/search';
import formatNumber from '../../helpers/formatNumber';
import Pagination from './components/pagination';
import SignBanner from './components/signBanner';
import FilterBox from '../../containers/filterBox';
import ArticleSpinner from '../common/spinner/articleSpinner';
import { changeSearchQuery } from '../../actions/searchQuery';
import SafeURIStringHandler from '../../helpers/safeURIStringHandler';
import ImprovedFooter from '../layouts/improvedFooter';
import KnowledgeBaseNoti from '../knowledgeBaseNoti';
import { getUserGroupName } from '../../helpers/abTestHelper';
import { AUTO_YEAR_FILTER_TEST } from '../../constants/abTestGlobalValue';
import AutoYearFilter from './components/autoYearFilter';
const styles = require('./articleSearch.scss');

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<any> & {
    search: Paper[];
  };

const SearchHelmet: React.FC<{ query: string }> = ({ query }) => {
  return (
    <Helmet>
      <title>{`${query} | Scinapse | Academic search engine for paper`}</title>
    </Helmet>
  );
};

interface AuthorSearchResult {
  isLoading: boolean;
  matchAuthors: MatchAuthor | null;
  shouldShow: boolean;
  queryParams: SearchPageQueryParams;
}
const AuthorSearchResult: React.FC<AuthorSearchResult> = React.memo(
  ({ matchAuthors, shouldShow, queryParams, isLoading }) => {
    if (isLoading || !shouldShow || !matchAuthors || matchAuthors.content.length === 0) return null;
    const authorCount = matchAuthors.totalElements;
    const authors = matchAuthors.content;

    const moreAuthorPage = (
      <Link
        to={{
          pathname: '/search/authors',
          search: SearchQueryManager.stringifyPapersQuery({
            query: queryParams.query || '',
            sort: 'RELEVANCE',
            filter: {},
            page: 1,
          }),
        }}
        className={styles.moreAuthorLink}
      >
        Show All Author Results >
      </Link>
    );

    const authorItems = authors.slice(0, 2).map(author => {
      return <AuthorSearchItem authorEntity={author} key={author.id} />;
    });

    return (
      <div className={styles.authorItemSectionWrapper}>
        <div className={styles.authorItemsHeader}>
          <span className={styles.categoryHeader}>Author</span>
          <span className={styles.categoryCount}>{authorCount}</span>
          {authorCount <= 2 ? null : moreAuthorPage}
        </div>
        <div className={styles.authorItemsWrapper}>{authorItems}</div>
      </div>
    );
  }
);

const SearchResult: React.FC<Props & { queryParams: SearchPageQueryParams; filter: FilterObject }> = props => {
  const { articleSearchState, currentUserState, queryParams, filter, location, layout } = props;

  const hasNoSearchResult =
    (!articleSearchState.searchItemsToShow || articleSearchState.searchItemsToShow.length === 0) && queryParams;
  const hasNoSearchResultAndNoAuthorResult =
    hasNoSearchResult &&
    (!articleSearchState.matchAuthors ||
      (articleSearchState.matchAuthors && articleSearchState.matchAuthors.totalElements === 0));
  const hasNoSearchResultButHasAuthorResult =
    hasNoSearchResult && articleSearchState.matchAuthors && articleSearchState.matchAuthors.totalElements > 0;
  const blockedDoiMatchedSearch =
    !currentUserState.isLoggedIn && articleSearchState.doiPatternMatched && !hasNoSearchResult;

  if (articleSearchState.isContentLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  }

  if (hasNoSearchResultButHasAuthorResult) {
    return (
      <div className={styles.innerContainer}>
        <NoResultInSearch
          searchText={queryParams.query}
          otherCategoryCount={articleSearchState.totalElements}
          type="paper"
        />
      </div>
    );
  }
  if (hasNoSearchResultAndNoAuthorResult) {
    return (
      <div className={styles.innerContainer}>
        <NoResult
          searchText={
            articleSearchState.suggestionKeyword.length > 0
              ? articleSearchState.suggestionKeyword
              : queryParams.query || ''
          }
          articleSearchState={articleSearchState}
          hasEmptyFilter={SearchQueryManager.isFilterEmpty(filter)}
        />
      </div>
    );
  }
  if (blockedDoiMatchedSearch) {
    return (
      <NoSsr>
        <div className={styles.innerContainer}>
          <DoiSearchBlocked isLoading={articleSearchState.isContentLoading} searchDoi={articleSearchState.doi || ''} />
        </div>
      </NoSsr>
    );
  }
  if (queryParams) {
    return (
      <div className={styles.innerContainer}>
        <FilterBox />
        <div className={styles.searchSummary}>
          <div>
            <span className={styles.categoryHeader}>Publication</span>
            <span className={styles.categoryCount}>{formatNumber(articleSearchState.totalElements)}</span>
          </div>
        </div>
        <SearchList
          currentUser={currentUserState}
          papers={articleSearchState.searchItemsToShow}
          isLoading={articleSearchState.isContentLoading}
          searchQueryText={articleSearchState.suggestionKeyword || queryParams.query || ''}
        />
        <Pagination
          page={articleSearchState.page}
          totalPages={articleSearchState.totalPages}
          currentUserDevice={layout.userDevice}
          location={location}
        />
        <KnowledgeBaseNoti />
      </div>
    );
  }
  return null;
};

const SearchContainer: React.FC<Props> = props => {
  const { articleSearchState, currentUserState, location, searchPapers, changeSearchQuery } = props;
  const [queryParams, setQueryParams] = React.useState<SearchPageQueryParams>(
    parse(location.search, { ignoreQueryPrefix: true })
  );
  const [useAutoYearFilter, setUseAutoYearFilter] = React.useState(true);
  const [filter, setFilter] = React.useState(SearchQueryManager.objectifyPaperFilter(queryParams.filter));
  const cancelToken = React.useRef(axios.CancelToken.source());

  React.useEffect(
    () => {
      if (currentUserState.isLoggingIn) return;

      const doAutoYearFilterSearch = getUserGroupName(AUTO_YEAR_FILTER_TEST) === 'auto';

      const currentQueryParams = parse(location.search, { ignoreQueryPrefix: true });

      if (articleSearchState.searchInput !== currentQueryParams.query) {
        setUseAutoYearFilter(true);
      }

      changeSearchQuery(SafeURIStringHandler.decode(currentQueryParams.query || ''));
      setQueryParams(currentQueryParams);
      setFilter(SearchQueryManager.objectifyPaperFilter(currentQueryParams.filter));

      // set params
      const params = SearchQueryManager.makeSearchQueryFromParamsObject(currentQueryParams);
      params.cancelToken = cancelToken.current.token;

      if (doAutoYearFilterSearch && useAutoYearFilter) {
        params.detectYear = true;
      } else {
        params.detectYear = false;
      }

      searchPapers(params).then(() => {
        restoreScroll(location.key);
      });

      return () => {
        cancelToken.current.cancel();
        cancelToken.current = axios.CancelToken.source();
      };
    },
    [
      location.key,
      location.search,
      currentUserState.isLoggedIn,
      currentUserState.isLoggingIn,
      searchPapers,
      useAutoYearFilter,
    ]
  );

  if (articleSearchState.pageErrorCode) {
    return <ErrorPage errorNum={articleSearchState.pageErrorCode} />;
  }

  return (
    <div className={styles.rootWrapper}>
      <SearchHelmet query={queryParams.query || ''} />
      <TabNavigationBar searchKeyword={articleSearchState.searchInput} />
      <div className={styles.articleSearchContainer}>
        <AutoYearFilter
          query={queryParams.query}
          detectedYear={articleSearchState.detectedYear}
          handleSetUseAutoYearFilter={setUseAutoYearFilter}
        />
        <Suggestions
          searchFromSuggestion={articleSearchState.searchFromSuggestion}
          suggestionKeyword={articleSearchState.suggestionKeyword}
          queryParams={queryParams}
        />
        <AuthorSearchResult
          isLoading={articleSearchState.isContentLoading}
          matchAuthors={articleSearchState.matchAuthors}
          queryParams={queryParams}
          shouldShow={articleSearchState.page === 1 && SearchQueryManager.isFilterEmpty(filter)}
        />
        <SearchResult {...props} queryParams={queryParams} filter={filter} />
        <div className={styles.rightBoxWrapper}>
          {!currentUserState.isLoggedIn && <SignBanner isLoading={articleSearchState.isContentLoading} />}
        </div>
      </div>
      <ImprovedFooter
        containerStyle={{
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white',
          width: '100%',
        }}
      />
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    layout: state.layout,
    articleSearchState: state.articleSearch,
    currentUserState: state.currentUser,
    configuration: state.configuration,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Actions>) =>
  bindActionCreators(
    {
      searchPapers,
      changeSearchQuery,
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles<typeof SearchContainer>(styles)(SearchContainer))
);
