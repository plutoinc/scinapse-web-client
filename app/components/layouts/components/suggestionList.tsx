import * as React from "react";
import { escapeRegExp } from "lodash";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./suggestionList.scss");

interface SuggestionListProps {
  userInput: string;
  isOpen: boolean;
  suggestionList: string[];
  isLoadingKeyword: boolean;
  handleClickSuggestionKeyword: (suggestion: string) => void;
}

function getWordsFromUserInput(userInput: string) {
  const words = userInput
    .split(" ")
    .map(word => {
      if (!!word && word.length > 0) {
        return escapeRegExp(word.trim());
      }
    })
    .join("|");

  return new RegExp(`(${words})`, "i");
}

const handleArrowKeyInput = (
  e: React.KeyboardEvent<HTMLAnchorElement>,
  handleEnter: (suggestion: string) => void,
  keyword: string
) => {
  switch (e.keyCode) {
    case 40: {
      // Down arrow
      e.preventDefault();
      const target: any = e.currentTarget.nextSibling;
      if (target) {
        target.focus();
      }
      break;
    }

    case 38: {
      // up arrow
      e.preventDefault();
      const target: any = e.currentTarget.previousSibling;
      if (target) {
        target.focus();
      }
      break;
    }

    case 13: {
      // enter
      e.preventDefault();
      handleEnter(keyword);
      break;
    }

    default:
      break;
  }
};

function getHighlightedList(suggestionList: string[], regExP: RegExp) {
  return suggestionList.map(suggestion => {
    const suggestionWords = suggestion.split(" ").map(word => word.trim());
    return suggestionWords.map(word => word && word.replace(regExP, matchWord => `<b>${matchWord}</b>`)).join(" ");
  });
}

const SuggestionList: React.SFC<SuggestionListProps> = props => {
  const regExP = getWordsFromUserInput(props.userInput);
  const highlightedList = getHighlightedList(props.suggestionList, regExP);

  const highlightedContent = highlightedList.map((suggestion, index) => (
    <a
      onMouseDown={e => {
        e.preventDefault();
        props.handleClickSuggestionKeyword(props.suggestionList[index]);
      }}
      className={styles.keywordCompletionItem}
      onKeyDown={e => {
        handleArrowKeyInput(e, props.handleClickSuggestionKeyword, props.suggestionList[index]);
      }}
      key={`keyword_completion_${suggestion}${index}`}
      tabIndex={-1}
    >
      <span dangerouslySetInnerHTML={{ __html: suggestion }} />
    </a>
  ));

  return (
    <div style={{ display: props.isOpen ? "block" : "none" }} className={styles.keywordCompletionWrapper}>
      {highlightedContent}
    </div>
  );
};

export default withStyles<typeof SuggestionList>(styles)(SuggestionList);

// const targetSearchQueryParams = PapersQueryFormatter.stringifyPapersQuery({
//   query: keyword.keyword,
//   page: 1,
//   sort: "RELEVANCE",
//   filter: {},
// });
