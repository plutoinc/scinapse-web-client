import React from 'react';
import { parse } from 'qs';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { withStyles } from '../../helpers/withStylesHelper';
import SearchQueryManager, { FilterObject } from '../../helpers/searchQueryManager';
const s = require('./filterBox.scss');

interface SelectButtonProps {
  content: string;
  isActive: boolean;
}
const SelectButton: React.FC<SelectButtonProps> = ({ content }) => {
  return <button>{content}</button>;
};

enum SELECTABLE_BUTTON {
  YEAR,
  JOURNAL,
  FOS,
  SORTING,
}

type FilterBoxAction =
  | { type: 'SET_ACTIVE_BUTTON'; payload: { button: SELECTABLE_BUTTON | null } }
  | { type: 'SYNC_FILTERS_WITH_QUERY_PARAMS'; payload: { filters: FilterObject } };

interface FilterBoxState {
  activeButton: SELECTABLE_BUTTON | null;
  yearFrom: number;
  yearTo: number;
  selectedJournalIds: number[];
  selectedFOSIds: number[];
}
const FILTER_BOX_INITIAL_STATE: FilterBoxState = {
  activeButton: null,
  yearFrom: 0,
  yearTo: 0,
  selectedJournalIds: [],
  selectedFOSIds: [],
};

function reducer(state = FILTER_BOX_INITIAL_STATE, action: FilterBoxAction) {
  switch (action.type) {
    case 'SYNC_FILTERS_WITH_QUERY_PARAMS': {
      const { filters } = action.payload;

      return {
        ...state,
        yearFrom: filters.yearFrom,
        yearTo: filters.yearTo,
        selectedJournalIds: filters.journal,
        selectedFOSIds: filters.fos,
      };
    }

    default:
      return state;
  }
}

interface FilterBoxProps {}
const FilterBox: React.FC<FilterBoxProps & RouteComponentProps> = props => {
  const [state, dispatch] = React.useReducer(reducer, FILTER_BOX_INITIAL_STATE);

  React.useEffect(
    () => {
      const currentQueryParams = parse(location.search, { ignoreQueryPrefix: true });
      const filters = SearchQueryManager.objectifyPaperFilter(currentQueryParams.filter);
      console.log('-----------------------------------------');
      console.log(filters);
      dispatch({ type: 'SYNC_FILTERS_WITH_QUERY_PARAMS', payload: { filters } });
    },
    [props.location.search]
  );

  console.log(state);

  return (
    <div>
      <SelectButton content={'Any time'} isActive={state.activeButton === SELECTABLE_BUTTON.YEAR} />
      <SelectButton content={'Any journal'} isActive={state.activeButton === SELECTABLE_BUTTON.JOURNAL} />
      <SelectButton content={'Any field'} isActive={state.activeButton === SELECTABLE_BUTTON.FOS} />
      <span>{` | Sort By `}</span>
      <SelectButton content={'Relevance'} isActive={state.activeButton === SELECTABLE_BUTTON.SORTING} />
    </div>
  );
};

export default withRouter(withStyles<typeof FilterBox>(s)(FilterBox));
