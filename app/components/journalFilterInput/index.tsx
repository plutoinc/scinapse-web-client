import React from 'react';
import axios, { CancelTokenSource } from 'axios';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import * as classNames from 'classnames';
import { withStyles } from '../../helpers/withStylesHelper';
import { useDebouncedAsyncFetch } from '../../hooks/debouncedFetchAPIHook';
import CompletionAPI, { JournalSuggestion } from '../../api/completion';
import Icon from '../../icons';
import reducer, { journalFilterInputInitialState } from './reducer';
import { handleInputKeydown } from '../common/InputWithSuggestionList/helpers/handleInputKeydown';
import JournalItem from '../journalFilterItem';
import { AggregationJournal } from '../../model/aggregation';
const s = require('./journalFilterInput.scss');

interface JournalFilterInputProps {
  forwardedRef: React.MutableRefObject<HTMLInputElement | null>;
  onSubmit: (journals: AggregationJournal[]) => void;
}

const JournalFilterInput: React.FC<JournalFilterInputProps> = props => {
  const cancelTokenSource = React.useRef<CancelTokenSource>(axios.CancelToken.source());
  const [state, dispatch] = React.useReducer(reducer, journalFilterInputInitialState);

  const { data: journalSuggestions, setParams: setKeyword } = useDebouncedAsyncFetch<string, JournalSuggestion[]>({
    initialParams: '',
    fetchFunc: async (q: string) => {
      const res = await CompletionAPI.fetchJournalSuggestion(q, cancelTokenSource.current.token);
      return res;
    },
    validateFunc: (query: string) => {
      if (!query || query.length < 2) throw new Error('keyword is too short');
    },
    wait: 200,
  });

  React.useEffect(
    () => {
      setKeyword(state.genuineInputValue);
      return () => {
        cancelTokenSource.current.cancel();
        cancelTokenSource.current = axios.CancelToken.source();
      };
    },
    [state.genuineInputValue]
  );

  let journalList = null;
  if (journalSuggestions && journalSuggestions.length > 0) {
    journalList = journalSuggestions.map((journal, i) => {
      return (
        <JournalItem
          key={journal.journalId}
          onClick={() => {
            handleSelectItem(i);
          }}
          IF={journal.impactFactor}
          checked={state.selectedJournalIds.includes(journal.journalId)}
          isHighlight={i === state.highlightIdx}
          title={journal.keyword}
          omitDocCount
        />
      );
    });
  }
  const shouldShowList = state.isOpen && journalList && journalList.length > 0;

  function handleSelectItem(index: number) {
    if (index > -1 && journalSuggestions) {
      const journal = journalSuggestions[index];

      dispatch({
        type: 'TOGGLE_JOURNAL',
        payload: {
          journalId: journal.journalId,
        },
      });
    }
  }

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (state.isOpen) {
          dispatch({ type: 'CLOSE_BOX' });
        }
      }}
    >
      <div className={classNames({ [s.wrapper]: true, [s.listOpened]: state.isOpen && !!journalList })}>
        <div className={s.inputWrapper}>
          <Icon icon="SEARCH_ICON" className={s.searchIcon} />
          <input
            ref={props.forwardedRef}
            value={state.inputValue}
            onKeyDown={e => {
              if (journalSuggestions && journalSuggestions.length > 0) {
                handleInputKeydown<JournalSuggestion>({
                  e,
                  list: journalSuggestions || [],
                  currentIdx: state.highlightIdx,
                  onMove: i => {
                    dispatch({
                      type: 'ARROW_KEYDOWN',
                      payload: {
                        targetIndex: i,
                        inputValue: journalSuggestions[i] ? journalSuggestions[i].keyword : state.genuineInputValue,
                      },
                    });
                  },
                  onSelect: i => {
                    handleSelectItem(i);
                  },
                });
              }
            }}
            onFocus={() => {
              dispatch({ type: 'OPEN_BOX' });
            }}
            onChange={e => {
              const { value } = e.currentTarget;
              dispatch({ type: 'CHANGE_INPUT', payload: { inputValue: value } });
            }}
            placeholder="Search journal or conference"
            className={classNames({
              [s.input]: true,
              [s.listOpened]: shouldShowList,
            })}
          />
        </div>
        {shouldShowList && (
          <div className={s.listWrapper}>
            {journalList}
            <div className={s.controlBtnsWrapper}>
              <button
                className={s.clearBtn}
                onClick={() => {
                  dispatch({ type: 'CLEAR' });
                }}
              >
                Clear
              </button>
              <button
                className={s.applyBtn}
                onClick={() => {
                  if (!journalSuggestions) {
                    return dispatch({ type: 'CLOSE_BOX' });
                  }

                  const journals: AggregationJournal[] = journalSuggestions
                    .filter(j => state.selectedJournalIds.includes(j.journalId))
                    .map(j => ({
                      id: j.journalId,
                      title: j.keyword,
                      docCount: 0,
                      impactFactor: j.impactFactor,
                      fromSearch: true,
                    }));
                  props.onSubmit(journals);
                  dispatch({ type: 'CLOSE_BOX' });
                }}
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default withStyles<typeof JournalFilterInput>(s)(JournalFilterInput);
