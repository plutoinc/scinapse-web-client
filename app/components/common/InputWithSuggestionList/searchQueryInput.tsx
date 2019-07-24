import * as React from 'react';
import axios, { CancelTokenSource } from 'axios';
import * as classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '../../../helpers/withStylesHelper';
import CompletionAPI, { CompletionKeyword } from '../../../api/completion';
import { useDebouncedAsyncFetch } from '../../../hooks/debouncedFetchAPIHook';
import { getHighlightedContent } from '../highLightedContent';
import Icon from '../../../icons';
import { trackEvent } from '../../../helpers/handleGA';
import {
  deleteQueryFromRecentList,
  getRecentQueries,
  saveQueryToRecentHistory,
} from '../../../helpers/recentQueryManager';
import PapersQueryFormatter, { FilterObject } from '../../../helpers/searchQueryManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { ACTION_TYPES } from '../../../actions/actionTypes';
import { AppState } from '../../../reducers';
import { UserDevice } from '../../layouts/records';
import { getCurrentPageType } from '../../locationListener';
import { handleInputKeydown } from './helpers/handleInputKeydown';
import { checkBlockSignUpConversion } from '../../../helpers/checkSignUpCount';
import { changeSearchQuery } from '../../../actions/searchQuery';
const s = require('./searchQueryInput.scss');

type SearchQueryInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  ReturnType<typeof mapStateToProps> &
  RouteComponentProps<any> & {
    dispatch: Dispatch<any>;
    actionArea: 'home' | 'topBar' | 'paperShow';
    maxCount: number;
    currentFilter?: FilterObject;
    wrapperClassName?: string;
    listWrapperClassName?: string;
    inputClassName?: string;
  };

type SearchSourceType = 'history' | 'suggestion' | 'raw';

interface SubmitParams {
  from: SearchSourceType;
  query: string;
  filter?: FilterObject;
}

function validateSearchInput(query: string) {
  if (query.length < 2) {
    return false;
  }
  return true;
}

async function shouldBlockUnsignedUser(actionArea: string) {
  return await checkBlockSignUpConversion({
    type: 'queryLover',
    matching: 'session',
    maxCount: 2,
    actionArea,
    userActionType: 'queryLover',
    expName: 'queryLover',
  });
}

const SearchQueryInput: React.FunctionComponent<SearchQueryInputProps> = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightIdx, setHighlightIdx] = React.useState(-1);
  const [inputValue, setInputValue] = React.useState('');
  const cancelTokenSource = React.useRef<CancelTokenSource>(axios.CancelToken.source());
  const { data: suggestionWords, setParams } = useDebouncedAsyncFetch<string, CompletionKeyword[]>({
    initialParams: '',
    fetchFunc: async (q: string) => {
      const res = await CompletionAPI.fetchSuggestionKeyword(q, cancelTokenSource.current.token);
      return res;
    },
    validateFunc: (query: string) => {
      if (!query || query.length < 2) throw new Error('keyword is too short');
    },
    wait: 200,
  });

  const [genuineInputValue, setGenuineInputValue] = React.useState('');
  React.useEffect(
    () => {
      setRecentQueries(getRecentQueries(genuineInputValue));
    },
    [genuineInputValue]
  );

  // prevent suggestion box is opened by auto focusing
  const [blockOpen, setBlockOpen] = React.useState(true);
  React.useEffect(() => {
    setBlockOpen(false);
  }, []);

  React.useEffect(
    () => {
      setInputValue(props.searchQuery);
      setGenuineInputValue(props.searchQuery);
    },
    [props.searchQuery]
  );

  const [recentQueries, setRecentQueries] = React.useState(getRecentQueries(genuineInputValue));
  let keywordsToShow = recentQueries.slice(0, props.maxCount);
  if (suggestionWords && suggestionWords.length > 0) {
    const suggestionList = suggestionWords
      .filter(k => recentQueries.every(query => query.text !== k.keyword))
      .map(k => ({ text: k.keyword, removable: false }));

    keywordsToShow = [...recentQueries, ...suggestionList].slice(0, props.maxCount);
  }

  React.useEffect(
    () => {
      return () => {
        setIsOpen(false);
        cancelTokenSource.current.cancel();
        cancelTokenSource.current = axios.CancelToken.source();
      };
    },
    [props.location]
  );

  async function handleSubmit({ query, filter, from }: SubmitParams) {
    const searchKeyword = (query || inputValue).trim();

    if (!validateSearchInput(searchKeyword)) {
      props.dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'error',
          message: 'You should search more than 2 characters.',
        },
      });
      return;
    }

    const shouldBlock = await shouldBlockUnsignedUser(props.actionArea);
    if (shouldBlock) {
      return;
    }

    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: 'fire',
      actionArea: props.actionArea,
      actionTag: 'query',
      actionLabel: searchKeyword,
    });
    if (from === 'history' || from === 'suggestion') {
      ActionTicketManager.trackTicket({
        pageType: getCurrentPageType(),
        actionType: 'fire',
        actionArea: props.actionArea,
        actionTag: from === 'history' ? 'searchHistoryQuery' : 'searchSuggestionQuery',
        actionLabel: searchKeyword,
      });
    }
    trackEvent({ category: 'Search', action: 'Query', label: searchKeyword });

    saveQueryToRecentHistory(searchKeyword);
    props.dispatch(changeSearchQuery(searchKeyword));
    setIsOpen(false);

    const currentPage = getCurrentPageType();
    const searchQuery = PapersQueryFormatter.stringifyPapersQuery({
      query: searchKeyword,
      sort: 'RELEVANCE',
      filter: filter || {},
      page: 1,
    });

    if (currentPage === 'authorSearchResult') {
      props.history.push(`/search/authors?${searchQuery}`);
    } else {
      props.history.push(`/search?${searchQuery}`);
    }
  }

  function clickSearchBtn() {
    let from: SearchSourceType = 'raw';
    const matchKeyword = keywordsToShow.find(k => k.text === inputValue);
    if (matchKeyword && matchKeyword.removable) {
      from = 'history';
    } else if (matchKeyword && !matchKeyword.removable) {
      from = 'suggestion';
    }

    handleSubmit({ query: genuineInputValue, filter: props.currentFilter, from });
  }

  const keywordItems = keywordsToShow.slice(0, props.maxCount).map((k, i) => {
    return (
      <li
        key={k.text + i}
        className={classNames({
          [s.listItem]: true,
          [s.highlight]: highlightIdx === i,
        })}
        onClick={() => {
          handleSubmit({ query: k.text, filter: props.currentFilter, from: k.removable ? 'history' : 'suggestion' });
        }}
      >
        <span dangerouslySetInnerHTML={{ __html: getHighlightedContent(k.text, genuineInputValue) }} />
        {k.removable && (
          <Icon
            onClick={e => {
              e.stopPropagation();
              deleteQueryFromRecentList(k.text);
              setRecentQueries(getRecentQueries(genuineInputValue));
            }}
            className={s.removeBtn}
            icon="X_BUTTON"
          />
        )}
      </li>
    );
  });

  const listWrapperClassName = props.listWrapperClassName ? props.listWrapperClassName : s.list;
  const keywordList = isOpen ? <ul className={listWrapperClassName}>{keywordItems}</ul> : null;
  const wrapperClassName = props.wrapperClassName ? props.wrapperClassName : s.wrapper;
  const inputClassName = props.inputClassName ? props.inputClassName : s.input;
  const placeholder =
    props.userDevice !== UserDevice.DESKTOP
      ? 'Search papers by keyword'
      : 'Search papers by title, author, doi or keyword';

  return (
    <ClickAwayListener
      onClickAway={() => {
        setIsOpen(false);
      }}
    >
      <div className={wrapperClassName}>
        <input
          aria-label="Scinapse search box"
          value={inputValue}
          onKeyDown={e => {
            handleInputKeydown({
              e,
              list: keywordsToShow,
              currentIdx: highlightIdx,
              onMove: i => {
                setHighlightIdx(i);
                setInputValue(keywordsToShow[i] ? keywordsToShow[i].text : genuineInputValue);
              },
              onSelect: i => {
                let from: SearchSourceType = 'raw';
                if (keywordsToShow[i] && keywordsToShow[i].removable) {
                  from = 'history';
                } else if (keywordsToShow[i] && !keywordsToShow[i].removable) {
                  from = 'suggestion';
                }

                handleSubmit({
                  query: keywordsToShow[i] ? keywordsToShow[i].text : genuineInputValue,
                  filter: props.currentFilter,
                  from,
                });
              },
            });
          }}
          onFocus={() => {
            if (!blockOpen && !isOpen) setIsOpen(true);
          }}
          onClick={() => {
            if (!isOpen) setIsOpen(true);
          }}
          onChange={e => {
            const { value } = e.currentTarget;
            setHighlightIdx(-1);
            setInputValue(value);
            setGenuineInputValue(value);
            setParams(value);
            if (!isOpen) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          autoFocus={props.autoFocus}
          className={inputClassName}
        />
        {props.actionArea == 'home' ? (
          <button onClick={clickSearchBtn} className={s.searchButton}>
            <Icon icon="SEARCH_ICON" className={s.searchIconInButton} />
            <span className={s.searchButtonText}>Search</span>
          </button>
        ) : (
          <button onClick={clickSearchBtn} className={s.searchIconButton}>
            <Icon icon="SEARCH_ICON" className={s.searchIcon} />
          </button>
        )}
        {keywordList}
      </div>
    </ClickAwayListener>
  );
};

function mapStateToProps(state: AppState) {
  return {
    userDevice: state.layout.userDevice,
    searchQuery: state.searchQueryState.query,
  };
}

export default connect(mapStateToProps)(withRouter(withStyles<typeof SearchQueryInput>(s)(SearchQueryInput)));
