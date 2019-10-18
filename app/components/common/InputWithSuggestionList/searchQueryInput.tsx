import * as React from 'react';
import axios, { CancelTokenSource } from 'axios';
import * as classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CompletionAPI, { CompletionKeyword } from '../../../api/completion';
import { useDebouncedAsyncFetch } from '../../../hooks/debouncedFetchAPIHook';
import { getHighlightedContent } from '../../../helpers/highlightContent';
import Icon from '../../../icons';
import { trackEvent } from '../../../helpers/handleGA';
import {
  deleteQueryFromRecentList,
  getRecentQueries,
  saveQueryToRecentHistory,
} from '../../../helpers/recentQueryManager';
import PapersQueryFormatter from '../../../helpers/searchQueryManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { ACTION_TYPES } from '../../../actions/actionTypes';
import { AppState } from '../../../reducers';
import { getCurrentPageType } from '../../locationListener';
import { handleInputKeydown } from './helpers/handleInputKeydown';
import { UserDevice } from '../../layouts/reducer';
import Button from '../button';
import { SearchQueryInputProps, SearchSourceType, SubmitParams } from './types';
import { changeSearchQuery, openMobileSearchBox } from '../../../reducers/searchQuery';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./searchQueryInput.scss');

function validateSearchInput(query: string) {
  if (query.length < 2) {
    return false;
  }
  return true;
}

function getSearchButton(actionArea: 'home' | 'topBar' | 'paperShow', onClick: () => void) {
  if (actionArea === 'home') {
    return (
      <div className={s.homeSearchButtonWrapper}>
        <Button elementType="button" size="small" onClick={onClick}>
          <Icon icon="SEARCH" className={s.searchIconInButton} />
          <span>SEARCH</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={s.searchButtonWrapper}>
      <Button elementType="button" size="small" variant="text" onClick={onClick}>
        <Icon icon="SEARCH" />
      </Button>
    </div>
  );
}

const SearchQueryInput: React.FunctionComponent<SearchQueryInputProps> = props => {
  useStyles(s);
  const dispatch = useDispatch();
  const searchQuery = useSelector<AppState, string>(state => state.searchQueryState.query);
  const isOpenMobileSearchBox = useSelector<AppState, boolean>(state => state.searchQueryState.isOpenMobileBox);
  const isMobile = useSelector<AppState, boolean>(state => state.layout.userDevice === UserDevice.MOBILE);
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
      setInputValue(searchQuery);
      setGenuineInputValue(searchQuery);
    },
    [searchQuery]
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

  async function handleSubmit({ query, from }: SubmitParams) {
    const searchKeyword = (query || inputValue).trim();

    if (!validateSearchInput(searchKeyword)) {
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'error',
          message: 'You should search more than 2 characters.',
        },
      });
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
    dispatch(changeSearchQuery({ query: searchKeyword }));
    setIsOpen(false);

    const currentPage = getCurrentPageType();
    const searchQuery = PapersQueryFormatter.stringifyPapersQuery({
      query: searchKeyword,
      sort: props.sort || 'RELEVANCE',
      filter: props.currentFilter || {},
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

    handleSubmit({ query: genuineInputValue, from });
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
          handleSubmit({ query: k.text, from: k.removable ? 'history' : 'suggestion' });
        }}
      >
        <span dangerouslySetInnerHTML={{ __html: getHighlightedContent(k.text, genuineInputValue) }} />
        {k.removable && (
          <Button
            elementType="button"
            size="small"
            variant="text"
            color="gray"
            onClick={e => {
              e.stopPropagation();
              deleteQueryFromRecentList(k.text);
              setRecentQueries(getRecentQueries(genuineInputValue));
            }}
          >
            <Icon icon="X_BUTTON" />
          </Button>
        )}
      </li>
    );
  });

  const listWrapperClassName = props.listWrapperClassName ? props.listWrapperClassName : s.list;
  const keywordList = isOpen ? <ul className={listWrapperClassName}>{keywordItems}</ul> : null;
  const wrapperClassName = props.wrapperClassName ? props.wrapperClassName : s.wrapper;
  const inputClassName = props.inputClassName ? props.inputClassName : s.input;
  const placeholder = isMobile ? 'Search papers by keyword' : 'Search papers by title, author, doi or keyword';
  const searchButton = getSearchButton(props.actionArea, clickSearchBtn);

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (!isMobile) setIsOpen(false);
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
                  from,
                });
              },
            });
          }}
          onFocus={e => {
            e.persist();

            if (document.hasFocus()) {
              window.addEventListener('touchstart', () => {
                e.target.blur();
              });
            }

            if (isMobile && !isOpenMobileSearchBox) dispatch(openMobileSearchBox());
            if (!isOpen) setIsOpen(true);
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
        {searchButton}
        {keywordList}
      </div>
    </ClickAwayListener>
  );
};

export default withRouter(SearchQueryInput);
