import React, { useCallback, Dispatch } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import { Button } from '@pluto_network/pluto-design-elements';
import FilterButton, { FILTER_BUTTON_TYPE } from '../filterButton';
import { AppState } from '../../reducers';
import { setActiveFilterButton } from '../../actions/searchFilter';
import { goToYearFilteredSearchResultPage } from '../yearRangeSlider/helper';
import { SearchActions } from '../../actions/actionTypes';
import YearGraph from '../yearGraph';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./yearFilterDropdown.scss');

type Props = RouteComponentProps;

const YearFilterDropdown: React.FC<Props> = React.memo(({ location, history }) => {
  useStyles(s);
  const dispatch = useDispatch<Dispatch<SearchActions>>();
  const detectedYear = useSelector((state: AppState) => state.searchFilterState.detectedYear);
  const currentYearFrom = useSelector((state: AppState) => state.searchFilterState.currentYearFrom);
  const currentYearTo = useSelector((state: AppState) => state.searchFilterState.currentYearTo);
  const isActive = useSelector((state: AppState) => state.searchFilterState.activeButton === FILTER_BUTTON_TYPE.YEAR);

  const getCurrentYearSet = useCallback(
    () => {
      if (detectedYear) return [detectedYear, detectedYear];
      return [currentYearFrom, currentYearTo];
    },
    [currentYearFrom, detectedYear, currentYearTo]
  );

  const [minMaxYears, setMinMaxYears] = React.useState<(number | string)[]>(getCurrentYearSet());

  React.useEffect(
    () => {
      setMinMaxYears(getCurrentYearSet());
    },
    [currentYearFrom, currentYearTo, detectedYear, getCurrentYearSet]
  );

  const anchorEl = React.useRef(null);
  const currentYear = new Date().getFullYear();
  const minYear = minMaxYears[0];
  const maxYear = minMaxYears[1];
  const selectChanged = currentYearFrom !== minYear || currentYearTo !== maxYear;

  let buttonText = 'Any time';
  if (minYear || maxYear) {
    buttonText = `${minYear || 'Past'} - ${maxYear || 'Current'}`;
  }

  function handleSubmit() {
    dispatch(setActiveFilterButton(null));
    if (selectChanged) {
      goToYearFilteredSearchResultPage({
        qs: location.search,
        history: history,
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
          if (isActive) {
            dispatch(setActiveFilterButton(null));
          } else {
            dispatch(setActiveFilterButton(FILTER_BUTTON_TYPE.YEAR));
          }
        }}
        content={buttonText}
        isActive={isActive}
        selected={!!minYear || !!maxYear}
      />
      <Popover
        onClose={() => {
          if (isActive) {
            handleSubmit();
          }
        }}
        open={isActive}
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
                qs: location.search,
                history: history,
                min: currentYear,
                max: currentYear,
                fromBtn: true,
              });
              dispatch(setActiveFilterButton(null));
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
                qs: location.search,
                history: history,
                min: currentYear - 3 + 1,
                max: currentYear,
                fromBtn: true,
              });
              dispatch(setActiveFilterButton(null));
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
                qs: location.search,
                history: history,
                min: currentYear - 5 + 1,
                max: currentYear,
                fromBtn: true,
              });
              dispatch(setActiveFilterButton(null));
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
        <div style={{ margin: '24px 0' }}>
          <YearGraph />
        </div>
        <div className={s.controlBtnsWrapper}>
          <Button
            elementType="button"
            aria-label="Clear year filter button"
            variant="text"
            color="gray"
            onClick={() => {
              setMinMaxYears(['', '']);
            }}
          >
            <span>Clear</span>
          </Button>
          <Button
            elementType="button"
            aria-label="Apply year filter button"
            variant="text"
            color="blue"
            onClick={handleSubmit}
          >
            <span>Apply</span>
          </Button>
        </div>
      </Popover>
    </div>
  );
});

export default withRouter(YearFilterDropdown);
