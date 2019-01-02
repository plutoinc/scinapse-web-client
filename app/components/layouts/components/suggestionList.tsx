import * as React from "react";
import { escapeRegExp } from "lodash";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
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
      className={classNames({
        [styles.keywordCompletionItem]: index != 0,
        [styles.highLightKeywordCompletionItem]: index === 0,
      })}
      onKeyDown={e => {
        handleArrowKeyInput(e, props.handleClickSuggestionKeyword, props.suggestionList[index]);
      }}
      key={`keyword_completion_${suggestion}${index}`}
      tabIndex={-1}
    >
      <span className={styles.keywordCompletionItemContext} dangerouslySetInnerHTML={{ __html: suggestion }} />
    </a>
  ));

  return (
    <div style={{ display: props.isOpen ? "block" : "none" }} className={styles.keywordCompletionWrapper}>
      {highlightedContent}
      {props.userInput.length > 0 && (
        <a
          onMouseDown={e => {
            e.preventDefault();
            props.handleClickSuggestionKeyword(props.userInput);
          }}
          className={classNames({
            [styles.keywordCompletionItem]: highlightedList.length > 0,
            [styles.highLightKeywordCompletionItem]: highlightedList.length === 0,
          })}
        >
          <span className={styles.enterAffiliationItemContext}>
            <Icon className={styles.plusIcon} icon="SMALL_PLUS" />Enter <b>“{props.userInput}”</b> as your affiliation
          </span>
        </a>
      )}
    </div>
  );
};

export default withStyles<typeof SuggestionList>(styles)(SuggestionList);
