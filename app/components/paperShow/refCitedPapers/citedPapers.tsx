import * as React from 'react';
import Axios from 'axios';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { withStyles } from '../../../helpers/withStylesHelper';
import { CurrentUser } from '../../../model/currentUser';
import getQueryParamsObject from '../../../helpers/getQueryParamsObject';
import RefCitedPaperList from './refCitedPaperList';
import SearchContainer, { getStringifiedUpdatedQueryParams } from './searchContainer';
import { AppState } from '../../../reducers';
import { makeGetMemoizedPapers, getMemoizedCitedPaperIds } from '../../../selectors/papersSelector';
import { getMemoizedPaperShow } from '../../../selectors/getPaperShow';
import { PaperShowPageQueryParams } from '../../../containers/paperShow/types';
import { fetchCitedPaperData } from '../../../containers/paperShow/sideEffect';
import RefCitedPagination from './refCitedPagination';
const styles = require('./referencePapers.scss');

const NAVBAR_HEIGHT = parseInt(styles.navbarHeight, 10) + 1;

const getCitedPapers = makeGetMemoizedPapers(getMemoizedCitedPaperIds);

function mapStateToProps(state: AppState) {
  return {
    paperShow: getMemoizedPaperShow(state),
    citedPapers: getCitedPapers(state),
  };
}

type Props = ReturnType<typeof mapStateToProps> &
  RouteComponentProps<any> & {
    isMobile: boolean;
    currentUser: CurrentUser;
    dispatch: Dispatch<any>;
    citedTabEl: HTMLDivElement | null;
  };

const getCitedPaginationLink = (paperId: number, queryParamsObject: any) => (page: number) => {
  return {
    to: `/papers/${paperId}`,
    search: getStringifiedUpdatedQueryParams(queryParamsObject, { 'cited-page': page }),
  };
};

const CitedPapers: React.FC<Props> = props => {
  const { isMobile, paperShow, citedPapers, currentUser, location, history, dispatch, citedTabEl } = props;
  const [queryParamsObject, setQueryParamsObject] = React.useState<PaperShowPageQueryParams>(
    getQueryParamsObject(location.search)
  );

  React.useEffect(
    () => {
      setQueryParamsObject(getQueryParamsObject(location.search));
    },
    [location.search]
  );

  React.useEffect(
    () => {
      const cancelToken = Axios.CancelToken.source();

      async function fetchCitedPapers() {
        await dispatch(
          fetchCitedPaperData(
            paperShow.paperId,
            queryParamsObject['cited-page'] || 1,
            queryParamsObject['cited-query'] || '',
            queryParamsObject['cited-sort'] || 'NEWEST_FIRST',
            cancelToken.token
          )
        );
      }
      fetchCitedPapers();
      citedTabEl && window.scrollTo(0, citedTabEl.offsetTop - NAVBAR_HEIGHT);

      return () => {
        cancelToken.cancel();
      };
    },
    [queryParamsObject['cited-page'], queryParamsObject['cited-query'], queryParamsObject['cited-sort']]
  );

  return (
    <>
      <SearchContainer paperShow={paperShow} type="cited" queryParamsObject={queryParamsObject} history={history} />
      <div>
        <RefCitedPaperList
          history={history}
          type="cited"
          papers={citedPapers}
          paperShow={paperShow}
          queryParamsObject={queryParamsObject}
          currentUser={currentUser}
        />
      </div>
      <div>
        <RefCitedPagination
          isMobile={isMobile}
          type="cited"
          paperShow={paperShow}
          handleGetPaginationLink={getCitedPaginationLink(paperShow.paperId, queryParamsObject)}
        />
      </div>
    </>
  );
};

export default connect(mapStateToProps)(withRouter(withStyles<typeof CitedPapers>(styles)(CitedPapers)));
