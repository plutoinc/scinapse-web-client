import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { withStyles } from '../../../helpers/withStylesHelper';
import getQueryParamsObject from '../../../helpers/getQueryParamsObject';
import RefCitedPaperList from './refCitedPaperList';
import SearchContainer from './searchContainer';
import { AppState } from '../../../reducers';
import { makeGetMemoizedPapers, getMemoizedCitedPaperIds } from '../../../selectors/papersSelector';
import { getMemoizedPaperShow } from '../../../selectors/getPaperShow';
import { PaperShowPageQueryParams } from '../../../containers/paperShow/types';
import RefCitedPagination from './refCitedPagination';
const styles = require('./referencePapers.scss');

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
    dispatch: Dispatch<any>;
    citedTabEl: HTMLDivElement | null;
  };

const CitedPapers: React.FC<Props> = props => {
  const { isMobile, paperShow, citedPapers, location, history } = props;
  const [queryParamsObject, setQueryParamsObject] = React.useState<PaperShowPageQueryParams>(
    getQueryParamsObject(location.search)
  );

  React.useEffect(
    () => {
      setQueryParamsObject(getQueryParamsObject(location.search));
    },
    [location.search]
  );

  return (
    <>
      <SearchContainer paperId={paperShow.paperId} type="cited" />
      <div>
        <RefCitedPaperList
          history={history}
          type="cited"
          papers={citedPapers}
          paperShow={paperShow}
          queryParamsObject={queryParamsObject}
        />
      </div>
      <div>
        <RefCitedPagination isMobile={isMobile} type="cited" paperId={paperShow.paperId} />
      </div>
    </>
  );
};

export default connect(mapStateToProps)(withRouter(withStyles<typeof CitedPapers>(styles)(CitedPapers)));
