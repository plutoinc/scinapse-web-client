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
import { makeGetMemoizedPapers, getMemoizedReferencePaperIds } from '../../../selectors/papersSelector';
import { getMemoizedPaperShow } from '../../../selectors/getPaperShow';
import { PaperShowPageQueryParams } from '../../../containers/paperShow/types';
import { fetchRefPaperData } from '../../../containers/paperShow/sideEffect';
import RefCitedPagination from './refCitedPagination';

const styles = require('./referencePapers.scss');

const NAVBAR_HEIGHT = parseInt(styles.navbarHeight, 10) + 1;

const getReferencePapers = makeGetMemoizedPapers(getMemoizedReferencePaperIds);

function mapStateToProps(state: AppState) {
  return {
    paperShow: getMemoizedPaperShow(state),
    referencePapers: getReferencePapers(state),
  };
}

type Props = ReturnType<typeof mapStateToProps> &
  RouteComponentProps<any> & {
    isMobile: boolean;
    currentUser: CurrentUser;
    dispatch: Dispatch<any>;
    refTabEl: HTMLDivElement | null;
  };

const getRefPaginationLink = (paperId: number, queryParamsObject: any) => (page: number) => {
  return {
    to: `/papers/${paperId}`,
    search: getStringifiedUpdatedQueryParams(queryParamsObject, { 'ref-page': page }),
  };
};

const ReferencePapers: React.FC<Props> = props => {
  const { isMobile, paperShow, referencePapers, currentUser, location, history, dispatch, refTabEl } = props;
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

      async function fetchRefPapers() {
        await dispatch(
          fetchRefPaperData(
            paperShow.paperId,
            queryParamsObject['ref-page'] || 1,
            queryParamsObject['ref-query'] || '',
            queryParamsObject['ref-sort'] || 'NEWEST_FIRST',
            cancelToken.token
          )
        );
      }
      fetchRefPapers();
      refTabEl && window.scrollTo(0, refTabEl.offsetTop - NAVBAR_HEIGHT);

      return () => {
        cancelToken.cancel();
      };
    },
    [queryParamsObject['ref-page'], queryParamsObject['ref-query'], queryParamsObject['ref-sort']]
  );

  return (
    <>
      <SearchContainer paperShow={paperShow} type="reference" queryParamsObject={queryParamsObject} history={history} />
      <div>
        <RefCitedPaperList
          history={history}
          type="reference"
          papers={referencePapers}
          paperShow={paperShow}
          queryParamsObject={queryParamsObject}
        />
      </div>
      <div>
        <RefCitedPagination
          isMobile={isMobile}
          type="reference"
          paperShow={paperShow}
          handleGetPaginationLink={getRefPaginationLink(paperShow.paperId, queryParamsObject)}
        />
      </div>
    </>
  );
};

export default connect(mapStateToProps)(withRouter(withStyles<typeof ReferencePapers>(styles)(ReferencePapers)));
