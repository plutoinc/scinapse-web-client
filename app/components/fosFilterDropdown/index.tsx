import React from 'react';
import { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import { setActiveFilterButton } from '../../actions/searchFilter';
import { ACTION_TYPES, SearchActions } from '../../actions/actionTypes';
import FilterButton, { FILTER_BUTTON_TYPE } from '../filterButton';
import { AppState } from '../../reducers';
import { trackSelectFilter } from '../../helpers/trackSelectFilter';
import makeNewFilterLink from '../../helpers/makeNewFilterLink';
import FOSFilterInput from '../fosFilterInput';
import FOSItem from './fosItem';
import { AggregationFos } from '../../model/aggregation';
import { Button } from '@pluto_network/pluto-design-elements';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./fosFilterDropdown.scss');

type Props = RouteComponentProps;

const FOSFilterDropdown: React.FC<Props> = ({ location, history }) => {
  useStyles(s);
  const dispatch = useDispatch<Dispatch<SearchActions>>();
  const selectedFOSIds = useSelector((state: AppState) => state.searchFilterState.selectedFOSIds);
  const FOSData = useSelector((state: AppState) => state.searchFilterState.fosList);
  const isActive = useSelector((state: AppState) => state.searchFilterState.activeButton === FILTER_BUTTON_TYPE.FOS);
  const [isHintOpened, setIsHintOpened] = React.useState(false);
  const inputEl = React.useRef<HTMLInputElement | null>(null);
  const anchorEl = React.useRef(null);
  const [lastSelectedFOS, setLastSelectedFOS] = React.useState(selectedFOSIds);
  const selectChanged = !isEqual(selectedFOSIds, lastSelectedFOS);

  React.useEffect(
    () => {
      if (!isActive) {
        setLastSelectedFOS(selectedFOSIds);
      }
    },
    [isActive, selectedFOSIds]
  );

  let buttonText = 'Any topic';
  if (selectedFOSIds.length === 1) {
    buttonText = `${selectedFOSIds.length} topic`;
  } else if (selectedFOSIds.length > 1) {
    buttonText = `${selectedFOSIds.length} topics`;
  }

  const FOSList = FOSData.map(FOS => {
    return (
      <FOSItem
        key={FOS.id}
        FOS={FOS}
        selected={selectedFOSIds.includes(String(FOS.id))}
        onClick={() => {
          dispatch({
            type: ACTION_TYPES.ARTICLE_SEARCH_SELECT_FOS_FILTER_ITEM,
            payload: { FOSId: FOS.id },
          });
        }}
      />
    );
  });

  function handleSubmit() {
    dispatch(setActiveFilterButton(null));

    if (selectChanged) {
      trackSelectFilter('FOS', JSON.stringify(selectedFOSIds));
      const link = makeNewFilterLink({ fos: selectedFOSIds }, location);
      history.push(link);
    }
  }

  return (
    <div ref={anchorEl}>
      <FilterButton
        onClick={() => {
          if (isActive) {
            dispatch(setActiveFilterButton(null));
          } else {
            dispatch(setActiveFilterButton(FILTER_BUTTON_TYPE.FOS));
          }
        }}
        content={buttonText}
        isActive={isActive}
        selected={selectedFOSIds.length > 0}
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
        <div className={s.filterWrapper}>
          <FOSFilterInput
            forwardedRef={inputEl}
            onSubmit={(FOSList: AggregationFos[]) => {
              dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_ADD_FOS_FILTER_ITEMS, payload: { FOSList } });
            }}
          />
          {isHintOpened && (
            <ClickAwayListener
              onClickAway={() => {
                setIsHintOpened(false);
              }}
            >
              <div className={s.hintWrapper}>
                <div className={s.hint}>Search other topics here</div>
              </div>
            </ClickAwayListener>
          )}
        </div>
        <div className={s.content}>
          <div className={s.FOSListWrapper}>
            <div className={s.listHeader}>
              <label className={s.FOSLabel}>Topic</label>
              <label className={s.countLabel}>Count</label>
            </div>
            {FOSList}
            <div className={s.searchInfo}>
              <span>{`Couldn't find topics? `}</span>
              <button
                onClick={() => {
                  if (!inputEl.current) return;
                  setIsHintOpened(true);
                  inputEl.current.focus();
                }}
                className={s.searchFocusButton}
              >
                Search more topics!
              </button>
            </div>
          </div>
          <div className={s.controlBtnsWrapper}>
            <Button
              elementType="button"
              aria-label="Clear fos filter button"
              variant="text"
              color="gray"
              onClick={() => {
                dispatch({
                  type: ACTION_TYPES.ARTICLE_SEARCH_CLEAR_FOS_FILTER,
                });
              }}
            >
              <span>Clear</span>
            </Button>
            <Button
              elementType="button"
              aria-label="Apply fos filter button"
              variant="text"
              color="blue"
              onClick={handleSubmit}
            >
              <span>Apply</span>
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default withRouter(FOSFilterDropdown);
