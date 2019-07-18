import React from 'react';
import { isEqual } from 'lodash';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Popper from '@material-ui/core/Popper';
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
  const anchorEl = React.useRef(null);
  const lastSelectedJournals = React.useRef(props.selectedJournalIds);
  const selectChanged = !isEqual(props.selectedJournalIds, lastSelectedJournals.current);

  let buttonText = 'Any journal';
  if (props.selectedJournalIds.length > 0) {
    buttonText = `${props.selectedJournalIds.length} journals`;
  }

  const journalList = props.journalData.map(journal => {
    return (
      <JournalItem
        key={journal.id}
        title={journal.title}
        checked={props.selectedJournalIds.includes(journal.id)}
        isHighlight={false}
        docCount={journal.docCount}
        IF={journal.impactFactor}
        onClick={() => {
          props.dispatch({
            type: ACTION_TYPES.ARTICLE_SEARCH_SELECT_JOURNAL_FILTER_ITEM,
            payload: { journalId: journal.id },
          });
        }}
      />
    );
  });

  function handleSubmit() {
    props.dispatch(setActiveFilterButton(null));

    if (selectChanged) {
      trackSelectFilter('JOURNAL', JSON.stringify(props.selectedJournalIds));
      lastSelectedJournals.current = props.selectedJournalIds;
      const link = makeNewFilterLink({ journal: props.selectedJournalIds }, props.location);
      props.history.push(link);
    }
  }

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (!props.isActive) return;
        handleSubmit();
      }}
    >
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
        <Popper
          modifiers={{
            preventOverflow: {
              enabled: false,
            },
            flip: {
              enabled: false,
            },
          }}
          open={props.isActive}
          anchorEl={anchorEl.current}
          placement="bottom-start"
          disablePortal
        >
          <div className={s.dropBoxWrapper}>
            <JournalFilterInput
              onSubmit={(journals: AggregationJournal[]) => {
                props.dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_ADD_JOURNAL_FILTER_ITEMS, payload: { journals } });
              }}
            />
            <div className={s.content}>
              <div className={s.journalListWrapper}>
                <div className={s.listHeader}>
                  <label className={s.journalLabel}>Journal name</label>
                  <label className={s.IFLabel}>Impact Factor</label>
                  <label className={s.countLabel}>Count</label>
                </div>
                {journalList}
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
          </div>
        </Popper>
      </div>
    </ClickAwayListener>
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
