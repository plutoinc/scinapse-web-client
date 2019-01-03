import * as React from "react";
import { escapeRegExp } from "lodash";
import { withStyles } from "../../../helpers/withStylesHelper";
import * as classNames from "classnames";

const styles = require("./suggestionList.scss");

export interface SuggestionListProps {
  userInput: string | undefined;
  isOpen: boolean;
  suggestionList: string[];
  isLoadingKeyword: boolean;
  handleClickSuggestionKeyword: (suggestion: string | undefined) => void;
}

interface SuggestionListState {
  onFocus: number | null;
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

const handleKeyDown = (
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

const SuggestionItem: React.SFC<
  SuggestionListProps & {
    keyword: string;
    isFocused: boolean;
    handleFocus?: () => void;
  }
> = props => {
  return (
    <a
      onMouseDown={e => {
        e.preventDefault();
        props.handleClickSuggestionKeyword(props.keyword);
      }}
      className={classNames({
        [styles.keywordCompletionItem]: !props.isFocused,
        [styles.highLightKeywordCompletionItem]: props.isFocused,
      })}
      onKeyDown={e => {
        handleKeyDown(e, props.handleClickSuggestionKeyword, props.keyword);
      }}
      tabIndex={-1}
      onFocus={() => {
        if (props.handleFocus) {
          props.handleFocus();
        }
      }}
    >
      {props.children}
    </a>
  );
};

class SuggestionList extends React.PureComponent<SuggestionListProps, SuggestionListState> {
  public constructor(props: SuggestionListProps) {
    super(props);

    this.state = {
      onFocus: 0,
    };
  }

  public componentWillReceiveProps(nextProps: Readonly<SuggestionListProps>): void {
    if (this.props.userInput !== nextProps.userInput) {
      this.setState(prevState => ({
        ...prevState,
        onFocus: 0,
      }));
    }
  }

  public render() {
    const { userInput, suggestionList, isOpen, children } = this.props;
    const { onFocus } = this.state;

    if (!userInput) {
      return null;
    }

    const regExP = getWordsFromUserInput(userInput);
    const highlightedList = getHighlightedList(suggestionList, regExP);

    const highlightedContent = highlightedList.map((suggestionWithHTML, index) => {
      return (
        <SuggestionItem
          {...this.props}
          handleFocus={() => {
            this.setState(prevState => ({ ...prevState, onFocus: index }));
          }}
          keyword={suggestionList[index]}
          isFocused={onFocus === index}
          key={index}
        >
          <span
            className={styles.keywordCompletionItemContext}
            dangerouslySetInnerHTML={{ __html: suggestionWithHTML }}
          />
        </SuggestionItem>
      );
    });

    return (
      <div style={{ display: isOpen ? "block" : "none" }} className={styles.keywordCompletionWrapper}>
        {highlightedContent}
        {children && (
          <SuggestionItem
            {...this.props}
            handleFocus={() => {
              this.setState(prevState => ({ ...prevState, onFocus: null }));
            }}
            isFocused={highlightedList.length === 0 || onFocus === null}
            keyword={userInput || ""}
          >
            {children}
          </SuggestionItem>
        )}
      </div>
    );
  }
}

export default withStyles<typeof SuggestionList>(styles)(SuggestionList);
