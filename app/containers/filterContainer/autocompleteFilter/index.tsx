import * as React from "react";
import axios, { CancelTokenSource } from "axios";
import { RouteComponentProps, withRouter } from "react-router-dom";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "../../../helpers/withStylesHelper";
import { useDebouncedAsyncFetch } from "../../../hooks/debouncedFetchAPIHook";
import CompletionAPI, { FOSSuggestion, JournalSuggestion } from "../../../api/completion";
import Icon from "../../../icons";
const s = require("./autocompleteFilter.scss");

interface FOSFilterBoxProps extends RouteComponentProps<any> {
  type: "FOS" | "JOURNAL";
}

interface ReducerState {
  isOpen: boolean;
  inputValue: string;
}

interface ReducerAction<T> {
  type: string;
  payload?: {
    suggestions?: T;
    inputValue?: string;
    errorMsg?: string;
  };
}

interface FilterItemProps {
  content: string;
  checked: boolean;
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

    default:
      throw new Error();
  }
}

const FilterItem: React.FunctionComponent<FilterItemProps> = props => {
  return (
    <div className={s.listItem}>
      <Checkbox
        classes={{
          root: s.checkboxIcon,
          checked: s.checkedCheckboxIcon,
        }}
        checked={props.checked}
      />
      {props.content}
    </div>
  );
};

const FOSFilterBox: React.FunctionComponent<FOSFilterBoxProps> = props => {
  const [state, dispatch] = React.useReducer(
    reducer as React.Reducer<ReducerState, ReducerAction<FOSSuggestion[] | JournalSuggestion[]>>,
    {
      isOpen: false,
      inputValue: "",
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
      setKeyword(state.inputValue);
      return () => {
        cancelTokenSource.current.cancel();
        cancelTokenSource.current = axios.CancelToken.source();
      };
    },
    [state.inputValue]
  );

  let listNode;
  if (props.type === "FOS") {
    listNode =
      data && (data as FOSSuggestion[]).map(fos => <FilterItem key={fos.fosId} content={fos.keyword} checked />);
  } else {
    listNode =
      data &&
      (data as JournalSuggestion[]).map(journal => (
        <FilterItem key={journal.journalId} content={journal.keyword} checked={false} />
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
      <div>
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
            className={s.input}
          />
        </div>
        {state.isOpen && listNode && <div className={s.listWrapper}>{listNode}</div>}
      </div>
    </ClickAwayListener>
  );
};

export default withRouter(withStyles<typeof FOSFilterBox>(s)(FOSFilterBox));
