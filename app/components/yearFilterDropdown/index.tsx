import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Popper from '@material-ui/core/Popper';
import YearRangeSlider from '../yearRangeSlider';
import FilterButton, { FILTER_BUTTON_TYPE } from '../filterButton';
import { withStyles } from '../../helpers/withStylesHelper';
import { Year } from '../../model/aggregation';
import { SearchActions } from '../../actions/actionTypes';
import { AppState } from '../../reducers';
import { setActiveFilterButton } from '../../actions/searchFilter';

const s = require('./yearFilterDropdown.scss');

interface YearFilterDropdownProps {
  isActive: boolean;
  currentYearFrom: number;
  currentYearTo: number;
  allYearData: Year[] | null;
  filteredYearData: Year[] | null;
  dispatch: Dispatch<SearchActions>;
}
const YearFilterDropdown: React.FC<YearFilterDropdownProps & ReturnType<typeof mapStateToProps>> = React.memo(props => {
  const [yearFrom, setYearFrom] = React.useState(props.currentYearFrom);
  const [yearTo, setYearTo] = React.useState(props.currentYearTo);
  const anchorEl = React.useRef(null);

  let buttonText = 'Any time';
  if (props.currentYearTo && props.currentYearFrom) {
    buttonText = `${props.currentYearFrom} - ${props.currentYearTo}`;
  }

  return (
    <>
      <span ref={anchorEl}>
        <FilterButton
          onClick={() => {
            props.dispatch(setActiveFilterButton(FILTER_BUTTON_TYPE.YEAR));
          }}
          content={buttonText}
          isActive={props.isActive}
        />
      </span>
      <Popper open={props.isActive} anchorEl={anchorEl.current}>
        <div className={s.dropBoxWrapper}>
          <div>
            <div>This Year</div>
            <div>Recent 3 years</div>
            <div>Recent 5 years</div>
            <div>Recent 10 years</div>
          </div>
          <div>
            <div>Since 2010</div>
            <div>Since 2000</div>
          </div>
          <YearRangeSlider
            yearInfo={props.allYearData || []}
            filteredYearInfo={props.filteredYearData || []}
            // TODO: support detectedYear
            detectedYear={null}
          />
        </div>
        <div>
          <input />
          <div className={s.hyphen} />
          <input />
        </div>
        <div>
          <button>Clear</button>
          <button>Apply</button>
        </div>
      </Popper>
    </>
  );
});

function mapStateToProps(state: AppState) {
  return {
    currentYearFrom: state.searchFilterState.currentYearFrom,
    currentYearTo: state.searchFilterState.currentYearTo,
    isActive: state.searchFilterState.activeButton === FILTER_BUTTON_TYPE.YEAR,
    allYearData: state.searchFilterState.yearAll,
    filteredYearData: state.searchFilterState.yearFiltered,
  };
}

export default connect(mapStateToProps)(withStyles<typeof YearFilterDropdown>(s)(YearFilterDropdown));
