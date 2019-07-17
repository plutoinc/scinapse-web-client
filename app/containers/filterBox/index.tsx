import React from 'react';
import classNames from 'classnames';
import { parse } from 'qs';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';
import { withStyles } from '../../helpers/withStylesHelper';
import SearchQueryManager from '../../helpers/searchQueryManager';
import { AppState } from '../../reducers';
import { ACTION_TYPES, SearchActions } from '../../actions/actionTypes';
import YearFilterDropdown from '../../components/yearFilterDropdown';
import JournalFilterDropdown from '../../components/journalFilterDropdown';
import FOSFilterDropdown from '../../components/fosFilterDropdown';
import SortingDropdown from '../../components/sortingDropdown';
import Icon from '../../icons';
import makeNewFilterLink from '../../helpers/makeNewFilterLink';
import { UserDevice } from '../../components/layouts/records';

const s = require('./filterBox.scss');

type FilterBoxProps = RouteComponentProps & ReturnType<typeof mapStateToProps> & { dispatch: Dispatch<SearchActions> };
const FilterBox: React.FC<FilterBoxProps> = props => {
  const filterBoxRef = React.useRef(null);

  React.useEffect(() => {
    const currentQueryParams = parse(location.search, { ignoreQueryPrefix: true });
    const filters = SearchQueryManager.objectifyPaperFilter(currentQueryParams.filter);
    props.dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_SYNC_FILTERS_WITH_QUERY_PARAMS,
      payload: {
        filters,
        sorting: currentQueryParams.sort || 'Relevance',
      },
    });
  }, []);

  if (props.isMobile) return null;

  return (
    <>
      <div
        ref={filterBoxRef}
        className={classNames({
          [s.wrapper]: true,
          [s.activeWrapper]: !!props.activeButton,
        })}
      >
        <div className={s.controlBtns}>
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
        {props.isFilterApplied && (
          <Link
            to={makeNewFilterLink(
              {
                yearFrom: undefined,
                yearTo: undefined,
                fos: [],
                journal: [],
              },
              props.location
            )}
            className={s.clearButton}
          >
            <Icon icon="X_BUTTON" className={s.xIcon} />
            <span>Clear All</span>
          </Link>
        )}
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

function mapStateToProps(state: AppState) {
  const { searchFilterState, layout } = state;
  return {
    isMobile: layout.userDevice === UserDevice.MOBILE,
    activeButton: searchFilterState.activeButton,
    isFilterApplied:
      !!searchFilterState.currentYearFrom ||
      !!searchFilterState.currentYearTo ||
      searchFilterState.selectedFOSIds.length > 0 ||
      searchFilterState.selectedJournalIds.length > 0,
  };
}

export default connect(mapStateToProps)(withRouter(withStyles<typeof FilterBox>(s)(FilterBox)));
