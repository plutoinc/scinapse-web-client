import React from 'react';
import { parse } from 'qs';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { withStyles } from '../../helpers/withStylesHelper';
import { setActiveFilterButton } from '../../actions/searchFilter';
import { SearchActions } from '../../actions/actionTypes';
import FilterButton, { FILTER_BUTTON_TYPE } from '../filterButton';
import { AppState } from '../../reducers';
import SearchQueryManager from '../../helpers/searchQueryManager';
import ActionTicketManager from '../../helpers/actionTicketManager';

const s = require('./sortingDropdown.scss');

interface SortingDropdownProps {
  dispatch: Dispatch<SearchActions>;
}

function trackSorting(sortOption: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS) {
  ActionTicketManager.trackTicket({
    pageType: 'searchResult',
    actionType: 'fire',
    actionArea: 'sortBar',
    actionTag: 'paperSorting',
    actionLabel: sortOption,
  });
}

function getSortText(sortOption: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS) {
  switch (sortOption) {
    case 'RELEVANCE': {
      return 'Relevance';
    }

    case 'NEWEST_FIRST': {
      return 'Newest';
    }

    case 'MOST_CITATIONS': {
      return 'Most Citations';
    }

    default:
      return 'Relevance';
  }
}

const SortingDropdown: React.FC<
  SortingDropdownProps & ReturnType<typeof mapStateToProps> & RouteComponentProps
> = React.memo(props => {
  const anchorEl = React.useRef(null);
  const queryParams = parse(location.search, { ignoreQueryPrefix: true });
  const filter = SearchQueryManager.objectifyPaperFilter(queryParams.filter);

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (props.isActive) {
          props.dispatch(setActiveFilterButton(null));
        }
      }}
    >
      <div ref={anchorEl}>
        <FilterButton
          onClick={() => {
            if (props.isActive) {
              props.dispatch(setActiveFilterButton(null));
            } else {
              props.dispatch(setActiveFilterButton(FILTER_BUTTON_TYPE.SORTING));
            }
          }}
          content={getSortText(props.sorting)}
          isActive={props.isActive}
          selected={false}
        />
        <Popper open={props.isActive} anchorEl={anchorEl.current} placement="bottom-start" disablePortal>
          <div className={s.dropBoxWrapper}>
            <Link
              to={{
                pathname: '/search',
                search: SearchQueryManager.stringifyPapersQuery({
                  query: props.query,
                  page: 1,
                  sort: 'RELEVANCE',
                  filter,
                }),
              }}
              className={s.sortBtn}
              onClick={() => {
                trackSorting('RELEVANCE');
                props.dispatch(setActiveFilterButton(null));
              }}
            >
              Relevance
            </Link>
            <Link
              to={{
                pathname: '/search',
                search: SearchQueryManager.stringifyPapersQuery({
                  query: props.query,
                  page: 1,
                  sort: 'NEWEST_FIRST',
                  filter,
                }),
              }}
              className={s.sortBtn}
              onClick={() => {
                trackSorting('NEWEST_FIRST');
                props.dispatch(setActiveFilterButton(null));
              }}
            >
              Newest
            </Link>
            <Link
              to={{
                pathname: '/search',
                search: SearchQueryManager.stringifyPapersQuery({
                  query: props.query,
                  page: 1,
                  sort: 'MOST_CITATIONS',
                  filter,
                }),
              }}
              className={s.sortBtn}
              onClick={() => {
                trackSorting('MOST_CITATIONS');
                props.dispatch(setActiveFilterButton(null));
              }}
            >
              Most citations
            </Link>
          </div>
        </Popper>
      </div>
    </ClickAwayListener>
  );
});

function mapStateToProps(state: AppState) {
  return {
    query: state.articleSearch.searchInput,
    sorting: state.searchFilterState.sorting,
    isActive: state.searchFilterState.activeButton === FILTER_BUTTON_TYPE.SORTING,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles<typeof SortingDropdown>(s)(SortingDropdown)));
