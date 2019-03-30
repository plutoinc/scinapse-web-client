import * as React from "react";
import axios, { CancelTokenSource } from "axios";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
import * as classNames from "classnames";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "../../../helpers/withStylesHelper";
import PapersQueryFormatter, { FilterObject } from "../../../helpers/papersQueryFormatter";
import { useDebouncedAsyncFetch } from "../../../hooks/debouncedFetchAPIHook";
import CompletionAPI, { FOSSuggestion, JournalSuggestion } from "../../../api/completion";
import Icon from "../../../icons";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import makeNewFilterLink from "../../../helpers/makeNewFilterLink";
import { toggleElementFromArray } from "../../../helpers/toggleElementFromArray";
const s = require("./autocompleteFilter.scss");

interface AutocompleteFilterProps extends RouteComponentProps<any> {
  type: "FOS" | "JOURNAL";
}

interface ReducerState {
  isOpen: boolean;
  inputValue: string;
  currentFilter: FilterObject;
}

interface ReducerAction<T> {
  type: string;
  payload?: {
    suggestions?: T;
    inputValue?: string;
    errorMsg?: string;
    filter?: FilterObject;
  };
}

interface FilterItemProps {
  content: string;
  checked: boolean;
  to: string;
}

function reducer<T>(state: ReducerState, action: ReducerAction<T>) {
  console.log(action.type);
  switch (action.type) {
    case "OPEN_BOX":
      return {
        ...state,
        isOpen: true,
      };

    case "CLOSE_BOX":
      return {
        ...state,
        isOpen: false,
      };

    case "CHANGE_INPUT": {
      if (action.payload) {
        return {
          ...state,
          inputValue: action.payload.inputValue,
          isOpen: true,
        };
      }
      return state;
    }

    case "CHANGE_LOCATION": {
      if (action.payload) {
        return {
          ...state,
          currentFilter: action.payload.filter,
        };
      }
      return state;
    }

    default:
      throw new Error();
  }
}

const FilterItem: React.FunctionComponent<FilterItemProps> = props => {
  return (
    <Link to={props.to} className={s.listItem}>
      <Checkbox
        classes={{
          root: s.checkboxIcon,
          checked: s.checkedCheckboxIcon,
        }}
        checked={props.checked}
      />
      {props.content}
    </Link>
  );
};

const AutocompleteFilter: React.FunctionComponent<AutocompleteFilterProps> = props => {
  const [state, dispatch] = React.useReducer(
    reducer as React.Reducer<ReducerState, ReducerAction<FOSSuggestion[] | JournalSuggestion[]>>,
    {
      isOpen: false,
      inputValue: "",
      currentFilter: PapersQueryFormatter.objectifyPapersFilter(getQueryParamsObject(props.location.search).filter),
    }
  );
  const cancelTokenSource = React.useRef<CancelTokenSource>(axios.CancelToken.source());
  const { data, setParams: setKeyword } = useDebouncedAsyncFetch<string, FOSSuggestion[] | JournalSuggestion[]>({
    initialParams: "",
    fetchFunc: async (q: string) => {
      if (props.type === "JOURNAL") {
        const res = await CompletionAPI.fetchJournalSuggestion(q, cancelTokenSource.current.token);
        return res;
      } else {
        const res = await CompletionAPI.fetchFOSSuggestion(q, cancelTokenSource.current.token);
        return res;
      }
    },
    validateFunc: (query: string) => {
      if (!query || query.length < 2) throw new Error("keyword is too short");
    },
    wait: 200,
  });

  React.useEffect(
    () => {
      dispatch({
        type: "CHANGE_LOCATION",
        payload: {
          filter: PapersQueryFormatter.objectifyPapersFilter(getQueryParamsObject(props.location.search).filter),
        },
      });
    },
    [props.location]
  );

  React.useEffect(
    () => {
      setKeyword(state.inputValue);
      return () => {
        cancelTokenSource.current.cancel();
        cancelTokenSource.current = axios.CancelToken.source();
      };
    },
    [state.inputValue]
  );

  const currentFOS = state.currentFilter && state.currentFilter.fos ? (state.currentFilter.fos as number[]) : [];
  const currentJournal =
    state.currentFilter && state.currentFilter.journal ? (state.currentFilter.journal as number[]) : [];

  let listNode;
  if (props.type === "FOS") {
    listNode =
      data &&
      (data as FOSSuggestion[]).map(fos => {
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
          />
        );
      });
  } else {
    listNode =
      data &&
      data.length > 0 &&
      (data as JournalSuggestion[]).map(journal => (
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
        />
      ));
  }

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (state.isOpen) {
          dispatch({ type: "CLOSE_BOX" });
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
          <Icon icon="SEARCH_ICON" className={s.searchIcon} />
          <input
            value={state.inputValue}
            onFocus={() => {
              if (data && data.length > 0) {
                dispatch({ type: "OPEN_BOX" });
              }
            }}
            onChange={e => {
              const { value } = e.currentTarget;
              dispatch({
                type: "CHANGE_INPUT",
                payload: {
                  inputValue: value,
                },
              });
            }}
            placeholder={props.type === "FOS" ? "Search Field Of Study..." : "Search Journal..."}
            className={classNames({
              [s.input]: true,
              [s.listOpened]: state.isOpen && !!listNode,
            })}
          />
        </div>
        {state.isOpen && listNode && <div className={s.listWrapper}>{listNode}</div>}
      </div>
    </ClickAwayListener>
  );
};

export default withRouter(withStyles<typeof AutocompleteFilter>(s)(AutocompleteFilter));
