import * as React from 'react';
import { Location, History } from 'history';
import { stringify } from 'qs';
import { Paper } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import { CurrentUser } from '../../../model/currentUser';
import DesktopPagination from '../../common/desktopPagination';
import { RELATED_PAPERS } from '../constants';
import { PaperShowState } from '../../../containers/paperShow/records';
import PaperItem from '../../common/paperItem';
import MobilePagination from '../../common/mobilePagination';
import getQueryParamsObject from '../../../helpers/getQueryParamsObject';
import { PaperShowPageQueryParams } from '../../../containers/paperShow/types';
import SortBox, { AUTHOR_PAPER_LIST_SORT_TYPES } from '../../common/sortBox';
import ScinapseInput from '../../common/scinapseInput';
import ArticleSpinner from '../../common/spinner/articleSpinner';
import Icon from '../../../icons';
const styles = require('./relatedPapers.scss');

interface ReferencePapersProps
  extends Readonly<{
      isMobile: boolean;
      type: RELATED_PAPERS;
      papers: Paper[];
      currentUser: CurrentUser;
      paperShow: PaperShowState;
      history: History;
      location: Location;
    }> {}

interface PaperListProps {
  relatedPapersTotalPage: number;
  queryInRelatedPapers: string;
  papers: Paper[];
  type: RELATED_PAPERS;
  currentUser: CurrentUser;
  isRelatedPapersLoading: boolean;
}
const PaperList: React.FC<PaperListProps> = props => {
  const { type, papers, relatedPapersTotalPage, currentUser, isRelatedPapersLoading, queryInRelatedPapers } = props;

  if (isRelatedPapersLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  }

  if ((!papers || papers.length === 0) && relatedPapersTotalPage === 0 && queryInRelatedPapers)
    return (
      <div className={styles.noPaperWrapper}>
        <Icon icon="UFO" className={styles.ufoIcon} />
        <div className={styles.noPaperDescription}>No related paper in this paper.</div>
      </div>
    );

  const referenceItems = papers.map(paper => {
    return (
      <div className={styles.paperShowPaperItemWrapper} key={paper.id}>
        <PaperItem
          pageType="paperShow"
          actionArea={type === 'reference' ? 'refList' : 'citedList'}
          currentUser={currentUser}
          paper={paper}
          wrapperStyle={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0, maxWidth: '100%' }}
        />
      </div>
    );
  });

  return <div className={styles.searchItems}>{referenceItems}</div>;
};

@withStyles<typeof ReferencePapers>(styles)
export default class ReferencePapers extends React.PureComponent<ReferencePapersProps> {
  public render() {
    const { type, location, paperShow } = this.props;
    const queryParamsObject: PaperShowPageQueryParams = getQueryParamsObject(location.search);

    let isRelatedPapersLoading;
    let relatedPapersTotalPage;
    let currentSearchQuery;

    if (type === 'reference') {
      relatedPapersTotalPage = paperShow.referencePaperTotalPage;
      isRelatedPapersLoading = paperShow.isLoadingReferencePapers;
      currentSearchQuery = queryParamsObject['ref-query'];
    } else {
      relatedPapersTotalPage = paperShow.citedPaperTotalPage;
      isRelatedPapersLoading = paperShow.isLoadingCitedPapers;
      currentSearchQuery = queryParamsObject['cited-query'];
    }

    return (
      <>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <ScinapseInput
              aria-label="Scinapse search box in paper show"
              value={currentSearchQuery}
              onSubmit={this.handleSubmitSearch}
              placeholder="Search papers"
              icon="SEARCH_ICON"
            />
          </div>
          {this.getSortBox()}
        </div>
        <div>
          <PaperList
            type={this.props.type}
            papers={this.props.papers}
            relatedPapersTotalPage={relatedPapersTotalPage}
            queryInRelatedPapers={currentSearchQuery || ''}
            currentUser={this.props.currentUser}
            isRelatedPapersLoading={isRelatedPapersLoading}
          />
        </div>
        <div>{this.getPagination()}</div>
      </>
    );
  }

  private getStringifiedUpdatedQueryParams = (pageQueryParams: any) => {
    const { location } = this.props;
    const queryParamsObject: PaperShowPageQueryParams = getQueryParamsObject(location.search);

    const updatedQueryParamsObject: PaperShowPageQueryParams = {
      ...queryParamsObject,
      ...pageQueryParams,
    };

    const stringifiedQueryParams = stringify(updatedQueryParamsObject, {
      addQueryPrefix: true,
    });

    return stringifiedQueryParams;
  };

  private handleSubmitSearch = (query: string) => {
    const { paperShow, type, history } = this.props;
    const { paperId } = paperShow;

    let pageQueryParams;

    if (type === 'reference') {
      pageQueryParams = { 'ref-query': query, 'ref-page': 1 };
    } else {
      pageQueryParams = { 'cited-query': query, 'cited-page': 1 };
    }

    history.push({
      pathname: `/papers/${paperId}`,
      search: this.getStringifiedUpdatedQueryParams(pageQueryParams),
    });
  };

  private getSortOptionChangeLink = (sortOption: AUTHOR_PAPER_LIST_SORT_TYPES) => {
    const { paperShow, type, history } = this.props;
    const { paperId } = paperShow;

    let pageQueryParams;

    if (type === 'reference') {
      pageQueryParams = { 'ref-sort': sortOption };
    } else {
      pageQueryParams = { 'cited-sort': sortOption };
    }

    history.push({
      pathname: `/papers/${paperId}`,
      search: this.getStringifiedUpdatedQueryParams(pageQueryParams),
    });
  };

  private getSortBox = () => {
    const { location, type } = this.props;
    const queryParamsObject: PaperShowPageQueryParams = getQueryParamsObject(location.search);
    const sortOption = type === 'reference' ? queryParamsObject['ref-sort'] : queryParamsObject['cited-sort'];

    return (
      <div className={styles.sortBoxContainer}>
        <SortBox
          handleClickSortOption={this.getSortOptionChangeLink}
          sortOption={sortOption || 'NEWEST_FIRST'}
          currentPage="journalShow"
          exposeRelevanceOption={false}
        />
      </div>
    );
  };

  private getPaginationLink = (page: number) => {
    const { paperShow, type } = this.props;
    const { paperId } = paperShow;

    let pageQueryParams;

    if (type === 'reference') {
      pageQueryParams = { 'ref-page': page };
    } else {
      pageQueryParams = { 'cited-page': page };
    }

    return {
      to: `/papers/${paperId}`,
      search: this.getStringifiedUpdatedQueryParams(pageQueryParams),
    };
  };

  private getPagination = () => {
    const { type, paperShow, isMobile } = this.props;
    const totalPage = type === 'cited' ? paperShow.citedPaperTotalPage : paperShow.referencePaperTotalPage;
    const currentPage = type === 'cited' ? paperShow.citedPaperCurrentPage : paperShow.referencePaperCurrentPage;

    if (isMobile) {
      return (
        <MobilePagination
          totalPageCount={totalPage}
          currentPageIndex={currentPage - 1}
          getLinkDestination={this.getPaginationLink}
          wrapperStyle={{
            margin: '12px 0',
          }}
        />
      );
    } else {
      return (
        <DesktopPagination
          type={`paper_show_${type}_papers`}
          totalPage={totalPage}
          currentPageIndex={currentPage - 1}
          getLinkDestination={this.getPaginationLink}
          wrapperStyle={{ margin: '32px 0 56px 0' }}
          actionArea={type === 'reference' ? 'refList' : 'citedList'}
        />
      );
    }
  };
}
