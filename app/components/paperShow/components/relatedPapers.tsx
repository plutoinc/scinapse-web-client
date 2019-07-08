import * as React from 'react';
import { Location, History } from 'history';
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
import { stringify } from 'qs';
import SortBox, { AUTHOR_PAPER_LIST_SORT_TYPES } from '../../common/sortBox';
import ScinapseInput from '../../common/scinapseInput';
import ArticleSpinner from '../../common/spinner/articleSpinner';
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
  papers: Paper[];
  type: RELATED_PAPERS;
  currentUser: CurrentUser;
}
const PaperList: React.FC<PaperListProps> = props => {
  const { type, papers, currentUser } = props;

  if (!papers || papers.length === 0) return null;

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

    if (
      (type === 'reference' && paperShow.isLoadingReferencePapers) ||
      (type === 'cited' && paperShow.isLoadingCitedPapers)
    ) {
      return (
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      );
    }

    return (
      <>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <ScinapseInput
              value={type === 'reference' ? queryParamsObject['ref-query'] : queryParamsObject['cited-query']}
              onSubmit={this.handleSubmitSearch}
              placeholder="Search papers in this journal"
              icon="SEARCH_ICON"
            />
          </div>
          {this.getSortBox()}
        </div>
        <div>
          <PaperList type={this.props.type} papers={this.props.papers} currentUser={this.props.currentUser} />
        </div>
        <div>{this.getPagination()}</div>
      </>
    );
  }

  private handleSubmitSearch = (query: string) => {
    const { paperShow, location, type, history } = this.props;
    const { paperId } = paperShow;
    const queryParamsObject: PaperShowPageQueryParams = getQueryParamsObject(location.search);

    let pageQueryParams;

    if (type === 'reference') {
      pageQueryParams = { 'ref-query': query };
    } else {
      pageQueryParams = { 'cited-query': query };
    }

    const updatedQueryParamsObject: PaperShowPageQueryParams = {
      ...queryParamsObject,
      ...pageQueryParams,
    };

    const stringifiedQueryParams = stringify(updatedQueryParamsObject, {
      addQueryPrefix: true,
    });

    history.push({
      pathname: `/papers/${paperId}`,
      search: stringifiedQueryParams,
    });
  };

  private getSortOptionChangeLink = (sortOption: AUTHOR_PAPER_LIST_SORT_TYPES) => {
    const { paperShow, location, type, history } = this.props;
    const { paperId } = paperShow;
    const queryParamsObject: PaperShowPageQueryParams = getQueryParamsObject(location.search);

    let pageQueryParams;

    if (type === 'reference') {
      pageQueryParams = { 'ref-sort': sortOption };
    } else {
      pageQueryParams = { 'cited-sort': sortOption };
    }

    const updatedQueryParamsObject: PaperShowPageQueryParams = {
      ...queryParamsObject,
      ...pageQueryParams,
    };

    const stringifiedQueryParams = stringify(updatedQueryParamsObject, {
      addQueryPrefix: true,
    });

    history.push({
      pathname: `/papers/${paperId}`,
      search: stringifiedQueryParams,
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
    const { paperShow, location, type } = this.props;
    const { paperId } = paperShow;
    const queryParamsObject: PaperShowPageQueryParams = getQueryParamsObject(location.search);

    let pageQueryParams;

    if (type === 'reference') {
      pageQueryParams = { 'ref-page': page };
    } else {
      pageQueryParams = { 'cited-page': page };
    }

    const updatedQueryParamsObject: PaperShowPageQueryParams = {
      ...queryParamsObject,
      ...pageQueryParams,
    };

    const stringifiedQueryParams = stringify(updatedQueryParamsObject, {
      addQueryPrefix: true,
    });

    return {
      to: `/papers/${paperId}`,
      search: stringifiedQueryParams,
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
