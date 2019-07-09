import React from 'react';
import { parse } from 'qs';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { withStyles } from '../../helpers/withStylesHelper';
import SearchQueryManager from '../../helpers/searchQueryManager';
import { AppState } from '../../reducers';
import YearFilterDropdown from '../../components/yearFilterDropdown';
import FilterButton, { FILTER_BUTTON_TYPE } from '../../components/filterButton';
import { getMemoizedSearchFilterState } from '../../selectors/getSearchFilter';
import { ACTION_TYPES, SearchActions } from '../../actions/actionTypes';
const s = require('./filterBox.scss');

type FilterBoxProps = RouteComponentProps & ReturnType<typeof mapStateToProps> & { dispatch: Dispatch<SearchActions> };
const FilterBox: React.FC<FilterBoxProps> = props => {
  const { searchFilterState } = props;
  React.useEffect(
    () => {
      const currentQueryParams = parse(location.search, { ignoreQueryPrefix: true });
      const filters = SearchQueryManager.objectifyPaperFilter(currentQueryParams.filter);
      props.dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_SYNC_FILTERS_WITH_QUERY_PARAMS, payload: { filters } });
    },

    [props.location.search]
  );

  return (
    <div>
      <YearFilterDropdown />
      <FilterButton
        onClick={() => {}}
        content={'Any journal'}
        isActive={searchFilterState.activeButton === FILTER_BUTTON_TYPE.JOURNAL}
      />
      <FilterButton
        onClick={() => {}}
        content={'Any field'}
        isActive={searchFilterState.activeButton === FILTER_BUTTON_TYPE.FOS}
      />
      <span>{` | Sort By `}</span>
      <FilterButton
        onClick={() => {}}
        content={'Relevance'}
        isActive={searchFilterState.activeButton === FILTER_BUTTON_TYPE.SORTING}
      />
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    searchFilterState: getMemoizedSearchFilterState(state),
  };
}

export default connect(mapStateToProps)(withRouter(withStyles<typeof FilterBox>(s)(FilterBox)));
