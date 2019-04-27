import * as React from "react";
import axios, { CancelTokenSource } from "axios";
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
import PapersQueryFormatter, { FilterObject } from "../../../helpers/papersQueryFormatter";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { AppState } from "../../../reducers";
import { LayoutState, UserDevice } from "../../layouts/records";
import { getCurrentPageType } from "../../locationListener";
import { handleInputKeydown } from "./helpers/handleInputKeydown";
import { getBlockedValueForQueryLoverTest, getUserGroupName } from "../../../helpers/abTestHelper";
import { QUERY_LOVER_TEST_NAME } from "../../../constants/abTestGlobalValue";
const s = require("./searchQueryInput.scss");

interface SearchQueryInputProps extends RouteComponentProps<any> {
  dispatch: Dispatch<any>;
  layout: LayoutState;
  actionArea: "home" | "topBar";
  maxCount: number;
  initialValue?: string;
  initialFilter?: FilterObject;
  wrapperClassName?: string;
  listWrapperClassName?: string;
  inputClassName?: string;
}

type SearchSourceType = "history" | "suggestion" | "raw";

interface SubmitParams {
  from: SearchSourceType;
  query?: string;
  filter?: FilterObject;
}

const SearchQueryInput: React.FunctionComponent<
  SearchQueryInputProps & React.InputHTMLAttributes<HTMLInputElement>
> = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(props.initialValue || "");
  const [genuineInputValue, setGenuineInputValue] = React.useState(props.initialValue || "");
  const [highlightIdx, setHighlightIdx] = React.useState(-1);
  const cancelTokenSource = React.useRef<CancelTokenSource>(axios.CancelToken.source());

  const { data: keywords, setParams } = useDebouncedAsyncFetch<string, CompletionKeyword[]>({
    initialParams: props.initialValue || "",
    fetchFunc: async (q: string) => {
      const res = await CompletionAPI.fetchSuggestionKeyword(q, cancelTokenSource.current.token);
      return res;
    },
    validateFunc: (query: string) => {
      if (!query || query.length < 2) throw new Error("keyword is too short");
    },
    wait: 200,
  });

  const recentQueries = getRecentQueries(genuineInputValue).map(q => ({ text: q, removable: true }));
  const [keywordsToShow, setKeywordsToShow] = React.useState(recentQueries);

  React.useEffect(
    () => {
      const suggestionList = keywords
        ? keywords
            .filter(k => !getRecentQueries(genuineInputValue).includes(k.keyword))
            .map(k => ({ text: k.keyword, removable: false }))
        : [];
      setKeywordsToShow([...recentQueries, ...suggestionList]);
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
      if (props.initialValue) {
        setInputValue(props.initialValue);
        setGenuineInputValue(props.initialValue);
      }
    },
    [props.initialValue]
  );

  React.useEffect(
    () => {
      return () => {
        setTouched(false);
        setIsOpen(false);
        cancelTokenSource.current.cancel();
        cancelTokenSource.current = axios.CancelToken.source();
      };
    },
    [props.location]
  );

  async function handleSubmit({ query, filter, from }: SubmitParams) {
    const searchKeyword = query || inputValue;

    if (searchKeyword.length < 2) {
      return props.dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: "error",
          message: "You should search more than 2 characters.",
        },
      });
    }

    const userGroupName: string = getUserGroupName(QUERY_LOVER_TEST_NAME) || "";

    const isBlocked = await getBlockedValueForQueryLoverTest(
      userGroupName,
      props.actionArea as Scinapse.ActionTicket.ActionArea
    );

    if (isBlocked) return;

    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: "fire",
      actionArea: props.actionArea,
      actionTag: "query",
      actionLabel: searchKeyword,
    });

    if (from === "history" || from === "suggestion") {
      ActionTicketManager.trackTicket({
        pageType: getCurrentPageType(),
        actionType: "fire",
        actionArea: props.actionArea,
        actionTag: from === "history" ? "searchHistoryQuery" : "searchSuggestionQuery",
        actionLabel: searchKeyword,
      });
    }

    trackEvent({ category: "Search", action: "Query", label: searchKeyword });
    saveQueryToRecentHistory(searchKeyword);
    setTouched(false);
    setIsOpen(false);

    props.history.push(
      `/search?${PapersQueryFormatter.stringifyPapersQuery({
        query: searchKeyword,
        sort: "RELEVANCE",
        filter: filter || {},
        page: 1,
      })}`
    );
  }

  const keywordItems = keywordsToShow.slice(0, props.maxCount).map((k, i) => {
    return (
      <li
        key={i}
        className={classNames({
          [s.listItem]: true,
          [s.highlight]: highlightIdx === i,
        })}
        onClick={() => {
          handleSubmit({ query: k.text, filter: props.initialFilter, from: k.removable ? "history" : "suggestion" });
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
            handleInputKeydown({
              e,
              list: keywordsToShow,
              currentIdx: highlightIdx,
              onMove: i => {
                setHighlightIdx(i);
                setInputValue(keywordsToShow[i] ? keywordsToShow[i].text : genuineInputValue);
              },
              onSelect: i => {
                let from: SearchSourceType = "raw";
                if (keywordsToShow[i] && keywordsToShow[i].removable) {
                  from = "history";
                } else if (keywordsToShow[i] && !keywordsToShow[i].removable) {
                  from = "suggestion";
                }

                handleSubmit({
                  query: keywordsToShow[i] ? keywordsToShow[i].text : genuineInputValue,
                  filter: props.initialFilter,
                  from,
                });
              },
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
            setHighlightIdx(-1);
            setInputValue(value);
            setGenuineInputValue(value);
            setIsOpen(true);
            setParams(value);
          }}
          placeholder={placeholder}
          autoFocus={props.autoFocus}
          className={inputClassName}
        />
        <Icon
          onClick={() => {
            let from: SearchSourceType = "raw";
            const matchKeyword = keywordsToShow.find(k => k.text === inputValue);
            if (matchKeyword && matchKeyword.removable) {
              from = "history";
            } else if (matchKeyword && !matchKeyword.removable) {
              from = "suggestion";
            }

            handleSubmit({
              filter: props.initialFilter,
              from,
            });
          }}
          icon="SEARCH_ICON"
          className={s.searchIcon}
        />
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
