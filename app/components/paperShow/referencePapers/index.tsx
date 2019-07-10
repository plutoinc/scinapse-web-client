import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';
import { Paper } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import { CurrentUser } from '../../../model/currentUser';
import DesktopPagination from '../../common/desktopPagination';
import { RELATED_PAPERS } from '../constants';
import { PaperShowState } from '../../../containers/paperShow/records';
import MobilePagination from '../../common/mobilePagination';
import getQueryParamsObject from '../../../helpers/getQueryParamsObject';
import ReferencePaperList from './referencePaperList';
import SearchContainer, { getStringifiedUpdatedQueryParams } from './searchContainer';
const styles = require('./referencePapers.scss');

type Props = RouteComponentProps<any> & {
  isMobile: boolean;
  type: RELATED_PAPERS;
  papers: Paper[];
  currentUser: CurrentUser;
  paperShow: PaperShowState;
};

interface ReferencePapersPaginationProps {
  isMobile: boolean;
  type: RELATED_PAPERS;
  paperShow: PaperShowState;
  handleGetPaginationLink: (page: number) => History.LocationDescriptor<any>;
}

const Pagination: React.FC<ReferencePapersPaginationProps> = props => {
  const { isMobile, paperShow, type, handleGetPaginationLink } = props;
  const totalPage = type === 'cited' ? paperShow.citedPaperTotalPage : paperShow.referencePaperTotalPage;
  const currentPage = type === 'cited' ? paperShow.citedPaperCurrentPage : paperShow.referencePaperCurrentPage;

  if (isMobile) {
    return (
      <MobilePagination
        totalPageCount={totalPage}
        currentPageIndex={currentPage - 1}
        getLinkDestination={handleGetPaginationLink}
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
        getLinkDestination={handleGetPaginationLink}
        wrapperStyle={{ margin: '32px 0 56px 0' }}
        actionArea={type === 'reference' ? 'refList' : 'citedList'}
      />
    );
  }
};

const getPaginationLink = (type: RELATED_PAPERS, paperId: number, queryParamsObject: any) => (page: number) => {
  let pageQueryParams;

  if (type === 'reference') {
    pageQueryParams = { 'ref-page': page };
  } else {
    pageQueryParams = { 'cited-page': page };
  }

  return {
    to: `/papers/${paperId}`,
    search: getStringifiedUpdatedQueryParams(queryParamsObject, pageQueryParams),
  };
};

const ReferencePapers: React.FC<Props> = props => {
  const { isMobile, paperShow, type, papers, currentUser, location, history } = props;
  const [queryParamsObject, setQueryParamsObject] = React.useState(getQueryParamsObject(location.search));

  React.useEffect(
    () => {
      setQueryParamsObject(getQueryParamsObject(location.search));
    },
    [location.search]
  );

  return (
    <>
      <SearchContainer paperShow={paperShow} type={type} queryParamsObject={queryParamsObject} history={history} />
      <div>
        <ReferencePaperList
          history={history}
          type={type}
          papers={papers}
          paperShow={paperShow}
          queryParamsObject={queryParamsObject}
          currentUser={currentUser}
        />
      </div>
      <div>
        <Pagination
          isMobile={isMobile}
          type={type}
          paperShow={paperShow}
          handleGetPaginationLink={getPaginationLink(type, paperShow.paperId, queryParamsObject)}
        />
      </div>
    </>
  );
};

export default withRouter(withStyles<typeof ReferencePapers>(styles)(ReferencePapers));
