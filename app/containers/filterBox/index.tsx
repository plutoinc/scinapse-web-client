import React from 'react';
import classNames from 'classnames';
import { parse } from 'qs';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { withStyles } from '../../helpers/withStylesHelper';
import SearchQueryManager from '../../helpers/searchQueryManager';
import { AppState } from '../../reducers';
import { ACTION_TYPES, SearchActions } from '../../actions/actionTypes';
import YearFilterDropdown from '../../components/yearFilterDropdown';
import JournalFilterDropdown from '../../components/journalFilterDropdown';
import FOSFilterDropdown from '../../components/fosFilterDropdown';
import SortingDropdown from '../../components/sortingDropdown';

const s = require('./filterBox.scss');

type FilterBoxProps = RouteComponentProps & ReturnType<typeof mapStateToProps> & { dispatch: Dispatch<SearchActions> };
const FilterBox: React.FC<FilterBoxProps> = props => {
  React.useEffect(
    () => {
      const currentQueryParams = parse(location.search, { ignoreQueryPrefix: true });
      const filters = SearchQueryManager.objectifyPaperFilter(currentQueryParams.filter);
      props.dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SYNC_FILTERS_WITH_QUERY_PARAMS,
        payload: {
          filters,
          sorting: currentQueryParams.sort || 'Relevance',
        },
      });
    },

    [props.location.search, props.activeButton]
  );

  return (
    <>
      <div
        className={classNames({
          [s.wrapper]: true,
          [s.activeWrapper]: !!props.activeButton,
        })}
      >
        <span className={s.btnWrapper}>
          <YearFilterDropdown />
        </span>
        <span className={s.btnWrapper}>
          <JournalFilterDropdown />
        </span>
        <span className={s.btnWrapper}>
          <FOSFilterDropdown />
        </span>
        <span className={s.divider}>{'|'}</span>
        <span className={s.sortText}>{`Sort By`}</span>
        <span className={s.btnWrapper}>
          <SortingDropdown />
        </span>
      </div>
      <div
        className={classNames({
          [s.backdrop]: true,
          [s.activeBackdrop]: !!props.activeButton,
        })}
      />
    </>
  );
};

// TODO: Remove below connect logic(it doesn't need it)
function mapStateToProps(state: AppState) {
  return {
    activeButton: state.searchFilterState.activeButton,
  };
}

export default connect(mapStateToProps)(withRouter(withStyles<typeof FilterBox>(s)(FilterBox)));
