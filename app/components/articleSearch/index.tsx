import * as React from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { parse } from 'qs';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import { withStyles } from '../../helpers/withStylesHelper';
import SearchQueryManager from '../../helpers/searchQueryManager';
import { AppState } from '../../reducers';
import ActionTicketManager from '../../helpers/actionTicketManager';
import TabNavigationBar from '../common/tabNavigationBar';
import Suggestions from './components/suggestions';
import ErrorPage from '../error/errorPage';
import { fetchCurrentUserFilters, searchPapers } from './actions';
import { Paper } from '../../model/paper';
import AuthorSearchItem from '../authorSearchItem';
import { Actions } from '../../actions/actionTypes';
import restoreScroll from '../../helpers/scrollRestoration';
import { SearchPageQueryParams } from './types';
import { MatchAuthor } from '../../api/search';
const styles = require('./articleSearch.scss');

function logSearchResult(searchResult?: Paper[] | null) {
  if (!searchResult || searchResult.length === 0) {
    ActionTicketManager.trackTicket({
      pageType: 'searchResult',
      actionType: 'view',
      actionArea: 'paperList',
      actionTag: 'pageView',
      actionLabel: String(0),
    });
  } else {
    ActionTicketManager.trackTicket({
      pageType: 'searchResult',
      actionType: 'view',
      actionArea: 'paperList',
      actionTag: 'pageView',
      actionLabel: String(searchResult.length),
    });
  }
}

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
  matchAuthors: MatchAuthor | null;
  shouldShow: boolean;
  queryParams: SearchPageQueryParams;
}
const AuthorSearchResult: React.FC<AuthorSearchResult> = React.memo(({ matchAuthors, shouldShow, queryParams }) => {
  if (!shouldShow || !matchAuthors || matchAuthors.content.length === 0) return null;
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
});

const SearchContainer: React.FC<Props> = props => {
  const { articleSearchState, currentUserState, location, fetchUserFilters, searchPapers } = props;
  const [queryParams, setQueryParams] = React.useState<SearchPageQueryParams>(
    parse(location.search, { ignoreQueryPrefix: true })
  );
  const [filter, setFilter] = React.useState(SearchQueryManager.objectifyPaperFilter(queryParams.filter));
  const cancelToken = React.useRef(axios.CancelToken.source());

  React.useEffect(
    () => {
      if (currentUserState.isLoggingIn) return;

      const currentQueryParams = parse(location.search, { ignoreQueryPrefix: true });
      setQueryParams(currentQueryParams);
      setFilter(SearchQueryManager.objectifyPaperFilter(currentQueryParams.filter));

      const params = SearchQueryManager.makeSearchQueryFromParamsObject(currentQueryParams);
      params.cancelToken = cancelToken.current.token;
      searchPapers(params).then(papers => {
        // TODO: change below logging logic because server could make error
        logSearchResult(papers);
        restoreScroll(location.key);
      });

      return () => {
        cancelToken.current.cancel();
        cancelToken.current = axios.CancelToken.source();
      };
    },
    [location, searchPapers, currentUserState]
  );

  React.useEffect(
    () => {
      if (currentUserState.isLoggedIn) {
        // TODO: add cancel logic
        fetchUserFilters();
      }
    },
    [currentUserState.isLoggedIn, fetchUserFilters]
  );

  if (articleSearchState.pageErrorCode) {
    return <ErrorPage errorNum={articleSearchState.pageErrorCode} />;
  }

  return (
    <div className={styles.rootWrapper}>
      <SearchHelmet query={queryParams.query || ''} />
      <TabNavigationBar searchKeyword={articleSearchState.searchInput} />
      <div className={styles.articleSearchContainer}>
        <Suggestions
          searchFromSuggestion={articleSearchState.searchFromSuggestion}
          suggestionKeyword={articleSearchState.suggestionKeyword}
          queryParams={queryParams}
        />
        <AuthorSearchResult
          matchAuthors={articleSearchState.matchAuthors}
          queryParams={queryParams}
          shouldShow={articleSearchState.page === 1 && SearchQueryManager.isFilterEmpty(filter)}
        />
      </div>
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
      fetchUserFilters: fetchCurrentUserFilters,
      searchPapers,
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles<typeof SearchContainer>(styles)(SearchContainer))
);
