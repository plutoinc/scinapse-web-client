import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import CompletionAPI, { CompletionKeyword } from "../../../api/completion";
import { useDebouncedAsyncFetch } from "../../../hooks/debouncedFetchAPIHook";
const s = require("./inputWithSuggestionList.scss");

interface SearchQueryInputProps {
  initialValue?: string;
}

async function fetchSuggestionKeyword(q: string) {
  const res = await CompletionAPI.fetchSuggestionKeyword(q);
  console.log("RES in fetchSuggestionKeyword function, ", res);
  return res;
}

const SearchQueryInput: React.FunctionComponent<
  SearchQueryInputProps & React.InputHTMLAttributes<HTMLInputElement>
> = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(props.initialValue || "");
  const { data, setParams } = useDebouncedAsyncFetch<string, CompletionKeyword[]>({
    initialParams: props.initialValue || "",
    fetchFunc: fetchSuggestionKeyword,
    validateFunc: (query: string) => {
      if (!query || query.length < 2) throw new Error("keyword is too short");
    },
    wait: 200,
  });

  const keywordList =
    isOpen &&
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
          setParams(value);
        }}
        placeholder="Search papers by title, author, doi or keyword"
        autoFocus={props.autoFocus}
      />
      <ul>{keywordList}</ul>
    </div>
  );
};

export default withStyles<typeof SearchQueryInput>(s)(SearchQueryInput);
