import React from 'react';
import classNames from 'classnames';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FilterButton, { FILTER_BUTTON_TYPE } from '../filterButton';
import { withStyles } from '../../helpers/withStylesHelper';
import { Year } from '../../model/aggregation';
import { SearchActions } from '../../actions/actionTypes';
import { AppState } from '../../reducers';
import { setActiveFilterButton } from '../../actions/searchFilter';
import { goToYearFilteredSearchResultPage } from '../yearRangeSlider/helper';

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
  const [minMaxYears, setMinMaxYears] = React.useState<(number | string)[]>([
    props.currentYearFrom,
    props.currentYearTo,
  ]);
  React.useEffect(
    () => {
      setMinMaxYears([props.currentYearFrom, props.currentYearTo]);
    },
    [props.currentYearFrom, props.currentYearTo]
  );

  const anchorEl = React.useRef(null);
  const currentYear = new Date().getFullYear();
  const minYear = minMaxYears[0];
  const maxYear = minMaxYears[1];

  let buttonText = 'Any time';
  if (props.currentYearTo || props.currentYearFrom) {
    buttonText = `${props.currentYearFrom} - ${props.currentYearTo}`;
  }

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
              props.dispatch(setActiveFilterButton(FILTER_BUTTON_TYPE.YEAR));
            }
          }}
          content={buttonText}
          isActive={props.isActive}
        />
        <Popper open={props.isActive} anchorEl={anchorEl.current} placement="bottom-start" disablePortal>
          <div className={s.dropBoxWrapper}>
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
            <div className={s.belowBtnsWrapper}>
              <button
                className={classNames({
                  [s.quickSelectText]: true,
                  [s.active]: minYear === 2010 && maxYear === currentYear,
                })}
                onClick={() => {
                  goToYearFilteredSearchResultPage({
                    qs: props.location.search,
                    history: props.history,
                    min: 2010,
                    max: currentYear,
                    fromBtn: true,
                  });
                  props.dispatch(setActiveFilterButton(null));
                }}
              >
                Since 2010
              </button>
              <button
                className={classNames({
                  [s.quickSelectText]: true,
                  [s.active]: minYear === 2000 && maxYear === currentYear,
                })}
                onClick={() => {
                  goToYearFilteredSearchResultPage({
                    qs: props.location.search,
                    history: props.history,
                    min: 2000,
                    max: currentYear,
                    fromBtn: true,
                  });
                  props.dispatch(setActiveFilterButton(null));
                }}
              >
                Since 2000
              </button>
            </div>
            <div className={s.inputBoxWrapper}>
              <input
                type="text"
                className={s.yearInput}
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
                className={s.yearInput}
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
              <button
                className={s.clearBtn}
                onClick={() => {
                  setMinMaxYears(['', '']);
                }}
              >
                Clear
              </button>
              <button
                className={s.applyBtn}
                onClick={() => {
                  props.dispatch(setActiveFilterButton(null));
                  goToYearFilteredSearchResultPage({
                    qs: props.location.search,
                    history: props.history,
                    min: minYear,
                    max: maxYear,
                  });
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </Popper>
      </div>
    </ClickAwayListener>
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

export default withRouter(connect(mapStateToProps)(withStyles<typeof YearFilterDropdown>(s)(YearFilterDropdown)));
