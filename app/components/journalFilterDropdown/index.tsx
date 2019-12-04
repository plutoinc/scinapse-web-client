import React from 'react';
import { isEqual } from 'lodash';
import { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import { Button } from '@pluto_network/pluto-design-elements';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { setActiveFilterButton } from '../../actions/searchFilter';
import { ACTION_TYPES, SearchActions } from '../../actions/actionTypes';
import FilterButton, { FILTER_BUTTON_TYPE } from '../filterButton';
import JournalItem from '../journalFilterItem';
import { AppState } from '../../reducers';
import { trackSelectFilter } from '../../helpers/trackSelectFilter';
import makeNewFilterLink from '../../helpers/makeNewFilterLink';
import JournalFilterInput from '../journalFilterInput';
import { AggregationJournal } from '../../model/aggregation';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./journalFilterDropdown.scss');

type Props = RouteComponentProps;

const JournalFilterDropdown: React.FC<Props> = ({ location, history }) => {
  useStyles(s);
  const dispatch = useDispatch<Dispatch<SearchActions>>();
  const selectedJournalIds = useSelector((state: AppState) => state.searchFilterState.selectedJournalIds);
  const journalData = useSelector((state: AppState) => state.searchFilterState.journals);
  const isActive = useSelector(
    (state: AppState) => state.searchFilterState.activeButton === FILTER_BUTTON_TYPE.JOURNAL
  );
  const anchorEl = React.useRef(null);
  const inputEl = React.useRef<HTMLInputElement | null>(null);
  const [isHintOpened, setIsHintOpened] = React.useState(false);
  const [lastSelectedJournals, setLastSelectedJournals] = React.useState(selectedJournalIds);
  const selectChanged = !isEqual(selectedJournalIds, lastSelectedJournals);

  React.useEffect(
    () => {
      if (!isActive) {
        setLastSelectedJournals(selectedJournalIds);
      }
    },
    [isActive, selectedJournalIds]
  );

  let buttonText = 'Any journal · conference';
  if (selectedJournalIds.length === 1) {
    buttonText = `${selectedJournalIds.length} journal · conference`;
  } else if (selectedJournalIds.length > 1) {
    buttonText = `${selectedJournalIds.length} journals · conferences`;
  }

  const handleClickJournalItem = React.useCallback(
    (journalId: string) => {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SELECT_JOURNAL_FILTER_ITEM,
        payload: { journalId },
      });
    },
    [dispatch]
  );

  const journalList =
    journalData &&
    journalData.map(journal => {
      return (
        <JournalItem
          key={journal.id}
          journal={journal}
          checked={selectedJournalIds.includes(String(journal.id))}
          onClick={handleClickJournalItem}
          isHighlight={false}
        />
      );
    });

  function handleSubmit() {
    dispatch(setActiveFilterButton(null));

    if (selectChanged) {
      trackSelectFilter('JOURNAL', JSON.stringify(selectedJournalIds));
      const link = makeNewFilterLink({ journal: selectedJournalIds }, location);
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
            dispatch(setActiveFilterButton(FILTER_BUTTON_TYPE.JOURNAL));
          }
        }}
        content={buttonText}
        isActive={isActive}
        selected={selectedJournalIds.length > 0}
      />
      <Popover
        onClose={() => {
          if (!isActive) return;
          handleSubmit();
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
          <JournalFilterInput
            forwardedRef={inputEl}
            onSubmit={(journals: AggregationJournal[]) => {
              dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_ADD_JOURNAL_FILTER_ITEMS, payload: { journals } });
            }}
          />
          {isHintOpened && (
            <ClickAwayListener
              onClickAway={() => {
                setIsHintOpened(false);
              }}
            >
              <div className={s.hint}>Search journal or conference here</div>
            </ClickAwayListener>
          )}
        </div>
        <div className={s.content}>
          <div className={s.journalListWrapper}>
            <div className={s.listHeader}>
              <label className={s.journalLabel}>Journal or Conference name</label>
              <label className={s.IFLabel}>Impact Factor</label>
              <label className={s.countLabel}>Count</label>
            </div>
            {journalList}
            <div className={s.searchInfo}>
              <span>{`Couldn't find any journal? `}</span>
              <button
                onClick={() => {
                  if (!inputEl.current) return;
                  setIsHintOpened(true);
                  inputEl.current.focus();
                }}
                className={s.searchFocusButton}
              >
                Search more journals or conferences!
              </button>
            </div>
          </div>
          <div className={s.controlBtnsWrapper}>
            <Button
              elementType="button"
              aria-label="Clear journal filter button"
              variant="text"
              color="gray"
              onClick={() => {
                dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_CLEAR_JOURNAL_FILTER });
              }}
            >
              <span>Clear</span>
            </Button>
            <Button
              elementType="button"
              aria-label="Apply journal filter button"
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

export default withRouter(JournalFilterDropdown);
