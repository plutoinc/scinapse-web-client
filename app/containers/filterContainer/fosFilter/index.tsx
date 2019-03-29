import * as React from "react";
import axios, { CancelTokenSource } from "axios";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import { useDebouncedAsyncFetch } from "../../../hooks/debouncedFetchAPIHook";
import CompletionAPI, { FOSSuggestion } from "../../../api/completion";
const s = require("./fosFilter.scss");

interface FOSFilterBoxProps extends RouteComponentProps<any> {}

interface ReducerState<T> {
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

function reducer<T>(state: ReducerState<T>, action: ReducerAction<T>) {
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
        };
      }
      return state;
    }

    default:
      throw new Error();
  }
}

const FOSFilterBox: React.FunctionComponent<FOSFilterBoxProps> = props => {
  const [state, dispatch] = React.useReducer(reducer as React.Reducer<ReducerState<any>, ReducerAction<any>>, {
    isOpen: false,
    inputValue: "",
  });
  const cancelTokenSource = React.useRef<CancelTokenSource>(axios.CancelToken.source());

  const { data: fosList, setParams: setKeyword } = useDebouncedAsyncFetch<string, FOSSuggestion[]>({
    initialParams: "",
    fetchFunc: async (q: string) => {
      const res = await CompletionAPI.fetchSuggestionFOS(q, cancelTokenSource.current.token);
      return res;
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

  const fosListNode = fosList && fosList.map(fos => <div key={fos.fosId}>{fos.keyword}</div>);

  return (
    <div>
      <input
        value={state.inputValue}
        onChange={e => {
          const { value } = e.currentTarget;
          dispatch({
            type: "CHANGE_INPUT",
            payload: {
              inputValue: value,
            },
          });
        }}
        placeholder="Search Field Of Study..."
        className={s.input}
      />
      <div>{fosListNode}</div>
    </div>
  );
};

export default withRouter(withStyles<typeof FOSFilterBox>(s)(FOSFilterBox));
