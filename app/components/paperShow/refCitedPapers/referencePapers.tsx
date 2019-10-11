import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { withStyles } from '../../../helpers/withStylesHelper';
import getQueryParamsObject from '../../../helpers/getQueryParamsObject';
import RefCitedPaperList from './refCitedPaperList';
import SearchContainer from './searchContainer';
import { AppState } from '../../../reducers';
import { makeGetMemoizedPapers, getMemoizedReferencePaperIds } from '../../../selectors/papersSelector';
import { getMemoizedPaperShow } from '../../../selectors/getPaperShow';
import { PaperShowPageQueryParams } from '../../../containers/paperShow/types';
import RefCitedPagination from './refCitedPagination';

const styles = require('./referencePapers.scss');

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
    dispatch: Dispatch<any>;
    refTabEl: HTMLDivElement | null;
  };

const ReferencePapers: React.FC<Props> = props => {
  const { isMobile, paperShow, referencePapers, location, history } = props;
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
      <SearchContainer paperId={paperShow.paperId} type="reference" />
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
        <RefCitedPagination isMobile={isMobile} type="reference" paperId={paperShow.paperId} />
      </div>
    </>
  );
};

export default connect(mapStateToProps)(withRouter(withStyles<typeof ReferencePapers>(styles)(ReferencePapers)));
