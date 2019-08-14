import React from 'react';
import { isEqual } from 'lodash';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { withStyles } from '../../helpers/withStylesHelper';
import { setActiveFilterButton } from '../../actions/searchFilter';
import { ACTION_TYPES, SearchActions } from '../../actions/actionTypes';
import FilterButton, { FILTER_BUTTON_TYPE } from '../filterButton';
import JournalItem from '../journalFilterItem';
import { AppState } from '../../reducers';
import { trackSelectFilter } from '../../helpers/trackSelectFilter';
import makeNewFilterLink from '../../helpers/makeNewFilterLink';
import JournalFilterInput from '../journalFilterInput';
import { AggregationJournal } from '../../model/aggregation';

const s = require('./journalFilterDropdown.scss');

interface JournalFilterDropdownProps {
  dispatch: Dispatch<SearchActions>;
}

const JournalFilterDropdown: React.FC<
  JournalFilterDropdownProps & ReturnType<typeof mapStateToProps> & RouteComponentProps
> = props => {
  const { dispatch } = props;
  const anchorEl = React.useRef(null);
  const inputEl = React.useRef<HTMLInputElement | null>(null);
  const [isHintOpened, setIsHintOpened] = React.useState(false);
  const [lastSelectedJournals, setLastSelectedJournals] = React.useState(props.selectedJournalIds);
  const selectChanged = !isEqual(props.selectedJournalIds, lastSelectedJournals);

  React.useEffect(
    () => {
      if (!props.isActive) {
        setLastSelectedJournals(props.selectedJournalIds);
      }
    },
    [props.isActive, props.selectedJournalIds]
  );

  let buttonText = 'Any journal · conference';
  if (props.selectedJournalIds.length > 0) {
    buttonText = `${props.selectedJournalIds.length} journals · conferences`;
  }

  const handleClickJournalItem = React.useCallback(
    (journalId: number) => {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SELECT_JOURNAL_FILTER_ITEM,
        payload: { journalId },
      });
    },
    [dispatch]
  );

  const journalList = props.journalData.map(journal => {
    return (
      <JournalItem
        key={journal.id}
        journal={journal}
        checked={props.selectedJournalIds.includes(journal.id)}
        onClick={handleClickJournalItem}
        isHighlight={false}
      />
    );
  });

  function handleSubmit() {
    props.dispatch(setActiveFilterButton(null));

    if (selectChanged) {
      trackSelectFilter('JOURNAL', JSON.stringify(props.selectedJournalIds));
      const link = makeNewFilterLink({ journal: props.selectedJournalIds }, props.location);
      props.history.push(link);
    }
  }

  return (
    <div ref={anchorEl}>
      <FilterButton
        onClick={() => {
          if (props.isActive) {
            props.dispatch(setActiveFilterButton(null));
          } else {
            props.dispatch(setActiveFilterButton(FILTER_BUTTON_TYPE.JOURNAL));
          }
        }}
        content={buttonText}
        isActive={props.isActive}
        selected={props.selectedJournalIds.length > 0}
      />
      <Popover
        onClose={() => {
          if (!props.isActive) return;
          handleSubmit();
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
        <div className={s.filterWrapper}>
          <JournalFilterInput
            forwardedRef={inputEl}
            onSubmit={(journals: AggregationJournal[]) => {
              props.dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_ADD_JOURNAL_FILTER_ITEMS, payload: { journals } });
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
            <button
              className={s.clearBtn}
              onClick={() => {
                props.dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_CLEAR_JOURNAL_FILTER });
              }}
            >
              Clear
            </button>
            <button className={s.applyBtn} onClick={handleSubmit}>
              Apply
            </button>
          </div>
        </div>
      </Popover>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    selectedJournalIds: state.searchFilterState.selectedJournalIds,
    journalData: state.searchFilterState.journals,
    isActive: state.searchFilterState.activeButton === FILTER_BUTTON_TYPE.JOURNAL,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles<typeof JournalFilterDropdown>(s)(JournalFilterDropdown)));
