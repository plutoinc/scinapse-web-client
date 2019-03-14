import * as React from "react";
import { debounce } from "lodash";
import { withStyles } from "../../../helpers/withStylesHelper";
import CompletionAPI, { CompletionKeyword } from "../../../api/completion";
const s = require("./inputWithSuggestionList.scss");

interface SearchQueryInputProps {
  initialValue?: string;
}

const lazyFetchKeywords = debounce(fetchSuggestionKeyword, 200, { leading: true });

async function fetchSuggestionKeyword(q: string, cb: (res: CompletionKeyword[]) => void) {
  const res = await CompletionAPI.fetchSuggestionKeyword(q);
  cb(res);
  return res;
}

const dataFetchReducer: React.Reducer<
  { isLoading: boolean; isError: boolean; data: CompletionKeyword[] },
  { type: string; payload?: CompletionKeyword[] }
> = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload || [],
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

function useDebouncedFetch(initialQuery: string) {
  const [query, setQuery] = React.useState(initialQuery);
  const [state, dispatch] = React.useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: [],
  });

  React.useEffect(
    () => {
      let cancel = false;

      if (!query || query.length < 2) return;

      async function lazyFetch() {
        dispatch({ type: "FETCH_INIT" });
        console.log(query);
        try {
          await lazyFetchKeywords(query, res => {
            if (!cancel) {
              dispatch({ type: "FETCH_SUCCESS", payload: res });
              console.log("cancel, ", cancel, res);
            }
          });
        } catch (err) {
          if (!cancel) {
            console.error(err);
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      }

      lazyFetch();

      return () => {
        cancel = true;
      };
    },
    [query]
  );

  return { ...state, setQuery };
}

const SearchQueryInput: React.FunctionComponent<
  SearchQueryInputProps & React.InputHTMLAttributes<HTMLInputElement>
> = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(props.initialValue || "");
  const { data, setQuery } = useDebouncedFetch(props.initialValue || "");

  console.log(data);

  const keywordList =
    data &&
    data.map((k, i) => {
      return <li key={i}>{k.keyword}</li>;
    });

  return (
    <div>
      <input
        value={inputValue}
        onFocus={() => {
          setIsOpen(true);
        }}
        onChange={e => {
          const { value } = e.currentTarget;
          setInputValue(value);
          setIsOpen(true);
          setQuery(value);
        }}
        placeholder="Search papers by title, author, doi or keyword"
        autoFocus={props.autoFocus}
      />
      <ul>{keywordList}</ul>
    </div>
  );
};

export default withStyles<typeof SearchQueryInput>(s)(SearchQueryInput);
