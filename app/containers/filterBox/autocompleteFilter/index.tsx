import * as React from 'react';
import axios, { CancelTokenSource } from 'axios';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { withStyles } from '../../../helpers/withStylesHelper';
import PapersQueryFormatter from '../../../helpers/searchQueryManager';
import { useDebouncedAsyncFetch } from '../../../hooks/debouncedFetchAPIHook';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import CompletionAPI, { FOSSuggestion, JournalSuggestion } from '../../../api/completion';
import Icon from '../../../icons';
import getQueryParamsObject from '../../../helpers/getQueryParamsObject';
import makeNewFilterLink from '../../../helpers/makeNewFilterLink';
import { toggleElementFromArray } from '../../../helpers/toggleElementFromArray';
import { handleInputKeydown } from '../../../components/common/InputWithSuggestionList/helpers/handleInputKeydown';
import FilterItem from './filterItem';
import reducer, { ReducerState, ReducerAction } from './reducer';
const s = require('./autocompleteFilter.scss');

interface AutocompleteFilterProps extends RouteComponentProps<any> {
  type: 'FOS' | 'JOURNAL';
}

const AutocompleteFilter: React.FunctionComponent<AutocompleteFilterProps> = props => {
  const currentFilter = React.useMemo(
    () => PapersQueryFormatter.objectifyPaperFilter(getQueryParamsObject(props.location.search).filter),
    [props.location.search]
  );

  const [state, dispatch] = React.useReducer(
    reducer as React.Reducer<ReducerState, ReducerAction<FOSSuggestion[] | JournalSuggestion[]>>,
    {
      isOpen: false,
      genuineInputValue: '',
      inputValue: '',
      highlightIdx: -1,
    }
  );
  const cancelTokenSource = React.useRef<CancelTokenSource>(axios.CancelToken.source());
  const { data, setParams: setKeyword } = useDebouncedAsyncFetch<string, FOSSuggestion[] | JournalSuggestion[]>({
    initialParams: '',
    fetchFunc: async (q: string) => {
      ActionTicketManager.trackTicket({
        pageType: 'searchResult',
        actionType: 'fire',
        actionArea: 'filter',
        actionTag: props.type === 'JOURNAL' ? 'journalSearch' : 'fosSearch',
        actionLabel: q,
      });

      if (props.type === 'JOURNAL') {
        const res = await CompletionAPI.fetchJournalSuggestion(q, cancelTokenSource.current.token);
        return res;
      } else {
        const res = await CompletionAPI.fetchFOSSuggestion(q, cancelTokenSource.current.token);
        return res;
      }
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

  const currentFOS = currentFilter && currentFilter.fos ? (currentFilter.fos as string[]) : [];
  const currentJournal = currentFilter && currentFilter.journal ? (currentFilter.journal as string[]) : [];

  let listNode;
  if (props.type === 'FOS') {
    listNode =
      data &&
      (data as FOSSuggestion[]).map((fos, i) => {
        return (
          <FilterItem
            to={makeNewFilterLink(
              {
                fos: toggleElementFromArray(fos.fosId, currentFOS, true),
              },
              props.location
            )}
            key={fos.fosId}
            content={fos.keyword}
            checked={currentFOS.includes(fos.fosId)}
            isHighlight={i === state.highlightIdx}
          />
        );
      });
  } else {
    listNode =
      data &&
      (data as JournalSuggestion[]).map((journal, i) => (
        <FilterItem
          key={journal.journalId}
          to={makeNewFilterLink(
            {
              journal: toggleElementFromArray(journal.journalId, currentJournal, true),
            },
            props.location
          )}
          content={journal.keyword}
          checked={currentJournal.includes(journal.journalId)}
          isHighlight={i === state.highlightIdx}
        />
      ));
  }

  function handleSelectItem(index: number) {
    if (index > -1 && data) {
      if (data[index].type === 'FOS') {
        const fos = data[index] as FOSSuggestion;
        props.history.push(
          makeNewFilterLink(
            {
              fos: toggleElementFromArray(fos.fosId, currentFOS, true),
            },
            props.location
          )
        );
      } else {
        const journal = data[index] as JournalSuggestion;
        props.history.push(
          makeNewFilterLink(
            {
              journal: toggleElementFromArray(journal.journalId, currentJournal, true),
            },
            props.location
          )
        );
      }
    }
  }

  const shouldShowList = state.isOpen && listNode && listNode.length > 0;

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (state.isOpen) {
          dispatch({ type: 'CLOSE_BOX' });
        }
      }}
    >
      <div
        className={classNames({
          [s.wrapper]: true,
          [s.listOpened]: state.isOpen && !!listNode,
        })}
      >
        <div className={s.inputWrapper}>
          <Icon icon="SEARCH" className={s.searchIcon} />
          <input
            value={state.inputValue}
            onKeyDown={e => {
              if (data && data.length > 0) {
                handleInputKeydown<FOSSuggestion | JournalSuggestion>({
                  e,
                  list: data || [],
                  currentIdx: state.highlightIdx,
                  onMove: i => {
                    dispatch({
                      type: 'ARROW_KEYDOWN',
                      payload: {
                        targetIndex: i,
                        inputValue: data[i] ? data[i].keyword : state.genuineInputValue,
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
              dispatch({
                type: 'CHANGE_INPUT',
                payload: {
                  inputValue: value,
                },
              });
            }}
            placeholder={props.type === 'FOS' ? 'Search Field of study...' : 'Search Journal...'}
            className={classNames({
              [s.input]: true,
              [s.listOpened]: shouldShowList,
            })}
          />
        </div>
        {shouldShowList && <div className={s.listWrapper}>{listNode}</div>}
      </div>
    </ClickAwayListener>
  );
};

export default withRouter(withStyles<typeof AutocompleteFilter>(s)(AutocompleteFilter));
