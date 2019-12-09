import React from 'react';
import { parse } from 'qs';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import { Button } from '@pluto_network/pluto-design-elements';
import { withStyles } from '../../helpers/withStylesHelper';
import { setActiveFilterButton } from '../../actions/searchFilter';
import { SearchActions } from '../../actions/actionTypes';
import FilterButton, { FILTER_BUTTON_TYPE } from '../filterButton';
import { AppState } from '../../reducers';
import SearchQueryManager from '../../helpers/searchQueryManager';
import ActionTicketManager from '../../helpers/actionTicketManager';

const s = require('./sortingDropdown.scss');

const SORTING_TYPES: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS[] = ['RELEVANCE', 'NEWEST_FIRST', 'MOST_CITATIONS'];

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

  function getNextLocation(sortOption: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS) {
    return {
      pathname: '/search',
      search: SearchQueryManager.stringifyPapersQuery({
        query: props.query,
        page: 1,
        sort: sortOption,
        filter,
      }),
    };
  }

  const sortingButtons = SORTING_TYPES.map(types => {
    return (
      <Button
        key={types}
        elementType="link"
        to={getNextLocation(types)}
        variant="text"
        color="black"
        onClick={() => {
          trackSorting(types);
          props.dispatch(setActiveFilterButton(null));
        }}
        fullWidth
      >
        <span style={{ textAlign: 'left' }}>{getSortText(types)}</span>
      </Button>
    );
  });

  return (
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
      <Popover
        onClose={() => {
          if (props.isActive) {
            props.dispatch(setActiveFilterButton(null));
          }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        elevation={0}
        transitionDuration={150}
        classes={{
          paper: s.dropBoxWrapper,
        }}
        open={props.isActive}
        anchorEl={anchorEl.current}
      >
        {sortingButtons}
      </Popover>
    </div>
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
