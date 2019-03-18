import * as React from "react";
import * as classNames from "classnames";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect, Dispatch } from "react-redux";
import { withStyles } from "../../../helpers/withStylesHelper";
import CompletionAPI, { CompletionKeyword } from "../../../api/completion";
import { useDebouncedAsyncFetch } from "../../../hooks/debouncedFetchAPIHook";
import { getHighlightedContent } from "../highLightedContent";
import Icon from "../../../icons";
import { trackEvent } from "../../../helpers/handleGA";
import {
  saveQueryToRecentHistory,
  deleteQueryFromRecentList,
  getRecentQueries,
} from "../../../helpers/recentQueryManager";
import PapersQueryFormatter from "../../../helpers/papersQueryFormatter";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { AppState } from "../../../reducers";
import { LayoutState, UserDevice } from "../../layouts/records";
const s = require("./searchQueryInput.scss");

const MAX_KEYWORD_SUGGESTION_LIST_COUNT = 10;

interface SearchQueryInputProps extends RouteComponentProps<any> {
  dispatch: Dispatch<any>;
  layout: LayoutState;
  actionArea: "home" | "topBar";
  initialValue?: string;
  wrapperClassName?: string;
  listWrapperClassName?: string;
  inputClassName?: string;
}

async function fetchSuggestionKeyword(q: string) {
  const res = await CompletionAPI.fetchSuggestionKeyword(q);
  return res;
}

interface HandleInputKeydownParams<L> {
  e: React.KeyboardEvent<HTMLInputElement>;
  list: L[];
  currentIdx: number;
  onMove: (i: number) => void;
  onSelect: () => void;
}

function handleInputKeydown<L>({ e, list, currentIdx, onMove, onSelect }: HandleInputKeydownParams<L>) {
  const maxIndex = list.length - 1;
  const minIdx = -1;
  const nextIdx = currentIdx + 1 > maxIndex ? -1 : currentIdx + 1;
  const prevIdx = currentIdx - 1 < minIdx ? maxIndex : currentIdx - 1;

  switch (e.keyCode) {
    case 13: {
      // enter
      e.preventDefault();
      onSelect();
      e.currentTarget.blur();
      break;
    }

    case 9: // tab
    case 40: {
      // down
      e.preventDefault();
      onMove(nextIdx);
      break;
    }

    case 38: {
      // up
      e.preventDefault();
      onMove(prevIdx);
      break;
    }

    default:
      break;
  }
}

const SearchQueryInput: React.FunctionComponent<
  SearchQueryInputProps & React.InputHTMLAttributes<HTMLInputElement>
> = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(props.initialValue || "");
  const [genuineInputValue, setGenuineInputValue] = React.useState(props.initialValue || "");
  const [highlightIdx, setHighlightIdx] = React.useState(-1);
  const { data: keywords, setParams } = useDebouncedAsyncFetch<string, CompletionKeyword[]>({
    initialParams: props.initialValue || "",
    fetchFunc: fetchSuggestionKeyword,
    validateFunc: (query: string) => {
      if (!query || query.length < 2) throw new Error("keyword is too short");
    },
    wait: 200,
  });

  const [touched, setTouched] = React.useState(false);

  const recentQueries = getRecentQueries(genuineInputValue).map(q => ({ text: q, removable: true }));
  const [keywordsToShow, setKeywordsToShow] = React.useState(recentQueries);

  React.useEffect(
    () => {
      const suggestionList = keywords
        ? keywords
            .filter(k => !getRecentQueries(genuineInputValue).includes(k.keyword))
            .map(k => ({ text: k.keyword, removable: false }))
        : [];
      setKeywordsToShow([...recentQueries, ...suggestionList].slice(0, MAX_KEYWORD_SUGGESTION_LIST_COUNT));
    },
    [keywords]
  );

  React.useEffect(
    () => {
      setKeywordsToShow(getRecentQueries(genuineInputValue).map(q => ({ text: q, removable: true })));
    },
    [genuineInputValue]
  );

  React.useEffect(
    () => {
      setTouched(false);
      setIsOpen(false);
    },
    [props.location]
  );

  function handleSubmit(query?: string) {
    if (inputValue.length < 2) {
      return props.dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: "error",
          message: "You should search more than 2 characters.",
        },
      });
    }

    ActionTicketManager.trackTicket({
      pageType: "home",
      actionType: "fire",
      actionArea: props.actionArea,
      actionTag: "query",
      actionLabel: query || inputValue,
    });

    trackEvent({ category: "Search", action: "Query", label: "" });

    saveQueryToRecentHistory(inputValue);

    setTouched(false);
    setIsOpen(false);

    props.history.push(
      `/search?${PapersQueryFormatter.stringifyPapersQuery({
        query: query || inputValue,
        sort: "RELEVANCE",
        filter: {},
        page: 1,
      })}`
    );
  }

  const keywordItems = keywordsToShow.map((k, i) => {
    return (
      <li
        key={i}
        className={classNames({
          [s.listItem]: true,
          [s.highlight]: highlightIdx === i,
        })}
        onClick={() => {
          setInputValue(k.text);
          handleSubmit(k.text);
        }}
      >
        <span dangerouslySetInnerHTML={{ __html: getHighlightedContent(k.text, genuineInputValue) }} />
        {k.removable && (
          <Icon
            onClick={e => {
              e.stopPropagation();
              deleteQueryFromRecentList(k.text);
              const index = keywordsToShow.findIndex(keyword => keyword.text === k.text);
              setKeywordsToShow([...keywordsToShow.slice(0, index), ...keywordsToShow.slice(index + 1)]);
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
    props.layout.userDevice !== UserDevice.DESKTOP
      ? "Search papers by keyword"
      : "Search papers by title, author, doi or keyword";

  return (
    <ClickAwayListener
      onClickAway={() => {
        setIsOpen(false);
      }}
    >
      <div className={wrapperClassName}>
        <input
          value={inputValue}
          onKeyDown={e => {
            if (!keywordsToShow || !keywordsToShow.length) return;
            handleInputKeydown({
              e,
              list: keywordsToShow,
              currentIdx: highlightIdx,
              onMove: i => {
                setHighlightIdx(i);
                setInputValue(keywordsToShow[i] ? keywordsToShow[i].text : genuineInputValue);
              },
              onSelect: handleSubmit,
            });
          }}
          onFocus={() => {
            if (touched) {
              setIsOpen(true);
            } else {
              setTouched(true);
            }
          }}
          onChange={e => {
            const { value } = e.currentTarget;

            setInputValue(value);
            setGenuineInputValue(value);
            setIsOpen(true);
            setParams(value);
          }}
          placeholder={placeholder}
          autoFocus={props.autoFocus}
          className={inputClassName}
        />
        <Icon onClick={handleSubmit} icon="SEARCH_ICON" className={s.searchIcon} />
        {keywordList}
      </div>
    </ClickAwayListener>
  );
};

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
  };
}

export default connect(mapStateToProps)(withRouter(withStyles<typeof SearchQueryInput>(s)(SearchQueryInput)));
