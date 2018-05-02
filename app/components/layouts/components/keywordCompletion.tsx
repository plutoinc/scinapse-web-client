import * as React from "react";
import { escapeRegExp } from "lodash";
import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import PapersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { CompletionKeywordList } from "../../../model/completion";
import { STOP_WORDS } from "../../common/searchQueryHighlightedContent";
const styles = require("./keywordCompletion.scss");

interface KeywordCompletionProps {
  query: string;
  isOpen: boolean;
  keywordList: CompletionKeywordList;
  isLoadingKeyword: boolean;
  handleClickCompletionKeyword: (path: string) => void;
}

@withStyles<typeof KeywordCompletion>(styles)
export default class KeywordCompletion extends React.PureComponent<KeywordCompletionProps, null> {
  public render() {
    const { query, keywordList, isOpen, handleClickCompletionKeyword } = this.props;

    const queryWords = query
      .split(" ")
      .filter(word => !STOP_WORDS.includes(word))
      .map(word => {
        if (!!word && word.length > 0) {
          return escapeRegExp(word.trim());
        }
      })
      .join("|");

    const regExp = new RegExp(`(${queryWords})`, "i");

    const keywords = keywordList.map((keyword, index) => {
      const targetSearchQueryParams = PapersQueryFormatter.stringifyPapersQuery({
        query: keyword.keyword,
        page: 0,
      });

      const keywordContentArray = keyword.keyword.split(" ").map(word => word.trim());
      const content = keywordContentArray
        .map(keywordContent => {
          return keywordContent.replace(regExp, matchWord => `<b>${matchWord}</b>`);
        })
        .join(" ");

      return (
        <Link
          to={{
            pathname: "/search",
            search: targetSearchQueryParams,
          }}
          onMouseDown={() => {
            handleClickCompletionKeyword(`/search?${targetSearchQueryParams}`);
          }}
          className={styles.keywordCompletionItem}
          onKeyDown={this.handleArrowKeyInput}
          key={`keyword_completion_${keyword}${index}`}
        >
          <span dangerouslySetInnerHTML={{ __html: content }} />
        </Link>
      );
    });

    return (
      <div style={{ display: isOpen ? "block" : "none" }} className={styles.keywordCompletionWrapper}>
        {keywords}
      </div>
    );
  }

  private handleArrowKeyInput = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.keyCode === 40) {
      // Down arrow
      e.preventDefault();
      const target: any = e.currentTarget.nextSibling;
      if (target && target.href) {
        target.focus();
      }
    } else if (e.keyCode === 38) {
      // up arrow
      e.preventDefault();
      const target: any = e.currentTarget.previousSibling;
      if (target && target.href) {
        target.focus();
      }
    }
  };
}
