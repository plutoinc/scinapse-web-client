import React from 'react';
import classNames from 'classnames';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import FilterButton, { FILTER_BUTTON_TYPE } from '../filterButton';
import { withStyles } from '../../helpers/withStylesHelper';
import { Year } from '../../model/aggregation';
import { SearchActions } from '../../actions/actionTypes';
import { AppState } from '../../reducers';
import { setActiveFilterButton } from '../../actions/searchFilter';
import { goToYearFilteredSearchResultPage } from '../yearRangeSlider/helper';
import Button from '../common/button';

const s = require('./yearFilterDropdown.scss');

interface YearFilterDropdownProps {
  isActive: boolean;
  currentYearFrom: number;
  currentYearTo: number;
  allYearData: Year[] | null;
  filteredYearData: Year[] | null;
  dispatch: Dispatch<SearchActions>;
}
const YearFilterDropdown: React.FC<
  YearFilterDropdownProps & ReturnType<typeof mapStateToProps> & RouteComponentProps
> = React.memo(props => {
  function getCurrentYearSet() {
    if (props.detectedYear) return [props.detectedYear, props.detectedYear];
    return [props.currentYearFrom, props.currentYearTo];
  }

  const [minMaxYears, setMinMaxYears] = React.useState<(number | string)[]>(getCurrentYearSet());

  React.useEffect(
    () => {
      setMinMaxYears(getCurrentYearSet());
    },
    [props.currentYearFrom, props.currentYearTo, props.detectedYear]
  );

  const anchorEl = React.useRef(null);
  const currentYear = new Date().getFullYear();
  const minYear = minMaxYears[0];
  const maxYear = minMaxYears[1];
  const selectChanged = props.currentYearFrom !== minYear || props.currentYearTo !== maxYear;

  let buttonText = 'Any time';
  if (minYear || maxYear) {
    buttonText = `${minYear || 'Past'} - ${maxYear || 'Current'}`;
  }

  function handleSubmit() {
    props.dispatch(setActiveFilterButton(null));
    if (selectChanged) {
      goToYearFilteredSearchResultPage({
        qs: props.location.search,
        history: props.history,
        min: minYear,
        max: maxYear,
      });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode !== 13) return;
    handleSubmit();
  }

  return (
    <div ref={anchorEl}>
      <FilterButton
        onClick={() => {
          if (props.isActive) {
            props.dispatch(setActiveFilterButton(null));
          } else {
            props.dispatch(setActiveFilterButton(FILTER_BUTTON_TYPE.YEAR));
          }
        }}
        content={buttonText}
        isActive={props.isActive}
        selected={!!minYear || !!maxYear}
      />
      <Popover
        onClose={() => {
          if (props.isActive) {
            handleSubmit();
          }
        }}
        open={props.isActive}
        anchorEl={anchorEl.current}
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
      >
        <div className={s.upperBtnsWrapper}>
          <button
            className={classNames({
              [s.quickSelectText]: true,
              [s.active]: minYear === currentYear && maxYear === currentYear,
            })}
            onClick={() => {
              goToYearFilteredSearchResultPage({
                qs: props.location.search,
                history: props.history,
                min: currentYear,
                max: currentYear,
                fromBtn: true,
              });
              props.dispatch(setActiveFilterButton(null));
            }}
          >
            This Year
          </button>
          <button
            className={classNames({
              [s.quickSelectText]: true,
              [s.active]: minYear === currentYear - 3 + 1 && maxYear === currentYear,
            })}
            onClick={() => {
              goToYearFilteredSearchResultPage({
                qs: props.location.search,
                history: props.history,
                min: currentYear - 3 + 1,
                max: currentYear,
                fromBtn: true,
              });
              props.dispatch(setActiveFilterButton(null));
            }}
          >
            Recent 3 years
          </button>
          <button
            className={classNames({
              [s.quickSelectText]: true,
              [s.active]: minYear === currentYear - 5 + 1 && maxYear === currentYear,
            })}
            onClick={() => {
              goToYearFilteredSearchResultPage({
                qs: props.location.search,
                history: props.history,
                min: currentYear - 5 + 1,
                max: currentYear,
                fromBtn: true,
              });
              props.dispatch(setActiveFilterButton(null));
            }}
          >
            Recent 5 years
          </button>
        </div>
        <div className={s.inputBoxWrapper}>
          <input
            type="text"
            placeholder="From year"
            className={s.yearInput}
            onKeyDown={handleKeyDown}
            onChange={e => {
              const { value } = e.currentTarget;
              if (!value) {
                return setMinMaxYears(['', maxYear]);
              }
              const year = parseInt(value, 10);
              if (!isNaN(year)) {
                setMinMaxYears([year, maxYear]);
              }
            }}
            value={minYear}
          />
          <div className={s.hyphen} />
          <input
            type="text"
            placeholder="To year"
            className={s.yearInput}
            onKeyDown={handleKeyDown}
            onChange={e => {
              const { value } = e.currentTarget;
              if (!value) {
                return setMinMaxYears([minYear, '']);
              }
              const year = parseInt(value, 10);
              if (!isNaN(year)) {
                setMinMaxYears([minYear, year]);
              }
            }}
            value={maxYear}
          />
        </div>
        <div className={s.controlBtnsWrapper}>
          <Button
            elementType="button"
            variant="text"
            color="gray"
            onClick={() => {
              setMinMaxYears(['', '']);
            }}
          >
            <span>Clear</span>
          </Button>
          <Button elementType="button" variant="text" color="blue" onClick={handleSubmit}>
            <span>Apply</span>
          </Button>
        </div>
      </Popover>
    </div>
  );
});

function mapStateToProps(state: AppState) {
  return {
    detectedYear: state.searchFilterState.detectedYear,
    currentYearFrom: state.searchFilterState.currentYearFrom,
    currentYearTo: state.searchFilterState.currentYearTo,
    isActive: state.searchFilterState.activeButton === FILTER_BUTTON_TYPE.YEAR,
    allYearData: state.searchFilterState.yearAll,
    filteredYearData: state.searchFilterState.yearFiltered,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles<typeof YearFilterDropdown>(s)(YearFilterDropdown)));
