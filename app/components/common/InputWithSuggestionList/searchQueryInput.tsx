import * as React from "react";
import { debounce } from "lodash";
import { withStyles } from "../../../helpers/withStylesHelper";
import CompletionAPI, { CompletionKeyword } from "../../../api/completion";
const s = require("./inputWithSuggestionList.scss");

interface SearchQueryInputProps {
  initialValue?: string;
}

const lazyFetchKeywords = debounce(fetchSuggestionKeyword, 200);

function fetchSuggestionKeyword(q: string) {
  return CompletionAPI.fetchSuggestionKeyword(q);
}

function useDebouncedFetch(initialQuery: string) {
  const [query, setQuery] = React.useState(initialQuery);
  const [data, setData] = React.useState<CompletionKeyword[]>([]);

  React.useEffect(
    () => {
      if (!query || query.length < 1) return;

      let cancel = false;

      lazyFetchKeywords(query)
        .then(res => {
          if (!cancel) {
            setData(res);
          }
        })
        .catch(err => {
          if (!cancel) {
            console.error(err);
          }
        });

      return () => {
        cancel = true;
      };
    },
    [query]
  );

  return { data, setQuery };
}

const SearchQueryInput: React.FunctionComponent<
  SearchQueryInputProps & React.InputHTMLAttributes<HTMLInputElement>
> = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(props.initialValue || "");
  const { data, setQuery } = useDebouncedFetch(inputValue);

  const keywordList = data.map((k, i) => {
    return <li key={i}>{k}</li>;
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
