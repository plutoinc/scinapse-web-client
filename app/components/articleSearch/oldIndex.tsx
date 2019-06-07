// import * as React from 'react';
// import { Helmet } from 'react-helmet';
// import { connect } from 'react-redux';
// import { Link, withRouter } from 'react-router-dom';
// import NoSsr from '@material-ui/core/NoSsr';
// import { AppState } from '../../reducers';
// import * as Actions from './actions';
// import SearchList from './components/searchList';
// import FilterContainer from '../../containers/filterContainer';
// import NoResult from './components/noResult';
// import PapersQueryFormatter from '../../helpers/searchQueryManager';
// import formatNumber from '../../helpers/formatNumber';
// import { ArticleSearchContainerProps } from './types';
// import { Footer } from '../layouts';
// import DesktopPagination from '../common/desktopPagination';
// import MobilePagination from '../common/mobilePagination';
// import { withStyles } from '../../helpers/withStylesHelper';
// import { UserDevice } from '../layouts/records';
// import AuthorSearchItem from '../authorSearchItem';
// import { ChangeRangeInputParams } from '../../constants/paperSearch';
// import ErrorPage from '../error/errorPage';
// import NoResultInSearch from './components/noResultInSearch';
// import TabNavigationBar from '../common/tabNavigationBar';
// import SortBar from './components/SortBar';
// import { getUrlDecodedQueryParamsObject } from '../../helpers/makeNewFilterLink';
// import DoiSearchBlocked from './components/doiSearchBlocked';
// import SignBanner from './components/signBanner';
// const styles = require('./articleSearch.scss');

// @withStyles<typeof ArticleSearch>(styles)
// class ArticleSearch extends React.PureComponent<ArticleSearchContainerProps> {
//   public render() {
//     return (
//       <div className={styles.rootWrapper}>
//         <div className={styles.articleSearchContainer}>
//           {this.isFilterEmpty(queryParams.filter) ? this.getAuthorEntitiesSection() : null}
//           {this.getInnerContainerContent()}
//           <div className={styles.rightBoxWrapper}>
//             {!currentUserState.isLoggedIn ? <SignBanner isLoading={articleSearchState.isContentLoading} /> : null}
//             <FilterContainer
//               handleChangeRangeInput={this.setRangeInput}
//               articleSearchState={articleSearchState}
//               currentUserState={currentUserState}
//               handleToggleExpandingFilter={this.handleToggleExpandingFilter}
//             />
//           </div>
//         </div>
//         <Footer containerStyle={this.getContainerStyle()} />
//       </div>
//     );
//   }

//   private getInnerContainerContent = () => {
//     const { articleSearchState, currentUserState, location } = this.props;
//     const { isContentLoading, totalElements, searchItemsToShow } = articleSearchState;

//     const queryParams = getUrlDecodedQueryParamsObject(location);

//     const hasNoSearchResult =
//       (!articleSearchState.searchItemsToShow || articleSearchState.searchItemsToShow.length === 0) && queryParams;

//     const hasNoSearchResultAndNoAuthorResult =
//       hasNoSearchResult &&
//       (!articleSearchState.matchAuthors ||
//         (articleSearchState.matchAuthors && articleSearchState.matchAuthors.totalElements === 0));

//     const hasNoSearchResultButHasAuthorResult =
//       hasNoSearchResult && articleSearchState.matchAuthors && articleSearchState.matchAuthors.totalElements > 0;

//     const blockedDoiMatchedSearch =
//       !currentUserState.isLoggedIn && articleSearchState.doiPatternMatched && !hasNoSearchResult;

//     if (hasNoSearchResultButHasAuthorResult) {
//       return (
//         <div className={styles.innerContainer}>
//           <NoResultInSearch
//             searchText={queryParams.query}
//             otherCategoryCount={articleSearchState.totalElements}
//             type="paper"
//           />
//         </div>
//       );
//     } else if (hasNoSearchResultAndNoAuthorResult) {
//       return (
//         <div className={styles.innerContainer}>
//           <NoResult
//             isLoading={isContentLoading}
//             searchText={
//               articleSearchState.suggestionKeyword.length > 0 ? articleSearchState.suggestionKeyword : queryParams.query
//             }
//             articleSearchState={articleSearchState}
//             hasEmptyFilter={this.isFilterEmpty(queryParams.filter)}
//           />
//         </div>
//       );
//     } else if (blockedDoiMatchedSearch) {
//       return (
//         <NoSsr>
//           <div className={styles.innerContainer}>
//             <DoiSearchBlocked isLoading={isContentLoading} searchDoi={articleSearchState.doi} />
//           </div>
//         </NoSsr>
//       );
//     } else if (queryParams) {
//       return (
//         <div className={styles.innerContainer}>
//           <div className={styles.searchSummary}>
//             <div>
//               <span className={styles.categoryHeader}>Publication</span>
//               <span className={styles.categoryCount}>{formatNumber(totalElements)}</span>
//             </div>
//             <SortBar query={queryParams.query} sortOption={queryParams.sort} filter={queryParams.filter} />
//           </div>
//           <SearchList
//             currentUser={currentUserState}
//             papers={searchItemsToShow}
//             isLoading={isContentLoading}
//             searchQueryText={articleSearchState.suggestionKeyword || queryParams.query}
//             currentPage={articleSearchState.page}
//           />
//           {this.getPaginationComponent()}
//         </div>
//       );
//     } else {
//       return null;
//     }
//   };

//   private isFilterEmpty = (filter: any) => {
//     const keys = Object.keys(filter);
//     for (const key of keys) {
//       if (typeof filter[key] === 'number' && !isNaN(filter[key])) {
//         return false;
//       } else if (typeof filter[key] === 'object' && filter[key].length !== 0) {
//         return false;
//       }
//     }
//     return true;
//   };

//   private getAuthorEntitiesSection = () => {
//     const { articleSearchState } = this.props;
//     const matchAuthorEntities = articleSearchState.matchAuthors;

//     if (matchAuthorEntities && matchAuthorEntities.content.length > 0 && articleSearchState.page === 1) {
//       const matchAuthorCount = matchAuthorEntities.totalElements;
//       const matchAuthorContent = matchAuthorEntities.content;
//       const moreAuthorPage = (
//         <Link
//           to={{
//             pathname: '/search/authors',
//             search: PapersQueryFormatter.stringifyPapersQuery({
//               query: articleSearchState.searchInput,
//               sort: 'RELEVANCE',
//               filter: {},
//               page: 1,
//             }),
//           }}
//           className={styles.moreAuthorLink}
//         >
//           Show All Author Results >
//         </Link>
//       );

//       const authorItems = matchAuthorContent.slice(0, 2).map(matchEntity => {
//         return <AuthorSearchItem authorEntity={matchEntity} key={matchEntity.id} />;
//       });

//       return (
//         <div className={styles.authorItemSectionWrapper}>
//           <div className={styles.authorItemsHeader}>
//             <span className={styles.categoryHeader}>Author</span>
//             <span className={styles.categoryCount}>{matchAuthorCount}</span>
//             {matchAuthorCount <= 2 ? null : moreAuthorPage}
//           </div>
//           <div className={styles.authorItemsWrapper}>{authorItems}</div>
//         </div>
//       );
//     }

//     return null;
//   };

//   private getContainerStyle = (): React.CSSProperties => {
//     const { layout } = this.props;

//     if (layout.userDevice !== UserDevice.DESKTOP) {
//       return { position: 'absolute', width: '100', bottom: 'unset' };
//     } else {
//       return { position: 'absolute', left: '0', right: '0', bottom: '0' };
//     }
//   };

//   private getPaginationComponent = () => {
//     const { articleSearchState, layout } = this.props;
//     const { page, totalPages } = articleSearchState;

//     const currentPageIndex: number = page - 1;

//     if (layout.userDevice !== UserDevice.DESKTOP) {
//       return (
//         <MobilePagination
//           totalPageCount={totalPages}
//           currentPageIndex={currentPageIndex}
//           getLinkDestination={this.makePaginationLink}
//           wrapperStyle={{
//             margin: '12px 0',
//           }}
//         />
//       );
//     } else {
//       return (
//         <DesktopPagination
//           type="paper_search_result"
//           totalPage={totalPages}
//           currentPageIndex={currentPageIndex}
//           getLinkDestination={this.makePaginationLink}
//           wrapperStyle={{
//             margin: '24px 0',
//           }}
//         />
//       );
//     }
//   };

//   private handleToggleExpandingFilter = () => {
//     const { dispatch } = this.props;

//     dispatch(Actions.toggleExpandingFilter());
//   };

//   private makePaginationLink = (page: number) => {
//     const { location } = this.props;

//     const queryParamsObject = getUrlDecodedQueryParamsObject(location);
//     const queryParams = PapersQueryFormatter.stringifyPapersQuery({
//       ...queryParamsObject,
//       page,
//     });

//     return `/search?${queryParams}`;
//   };

//   private setRangeInput = (params: ChangeRangeInputParams) => {
//     const { dispatch } = this.props;

//     dispatch(Actions.changeRangeInput(params));
//   };
// }
// export default withRouter(connect(mapStateToProps)(ArticleSearch));
