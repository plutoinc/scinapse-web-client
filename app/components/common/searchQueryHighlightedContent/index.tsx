import * as React from "react";
import { Link } from "react-router-dom";

interface ISearchQueryContentProps {
  content: string;
  searchQueryText: string;
  nameForKey: string;
  className?: string;
  searchQueryClassName?: string;
  onClickFunc?: () => void;
  href?: string;
  to?: string;
}

const STOP_WORDS = [
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "if",
  "in",
  "into",
  "is",
  "it",
  "no",
  "not",
  "of",
  "on",
  "or",
  "such",
  "that",
  "the",
  "their",
  "then",
  "there",
  "these",
  "they",
  "this",
  "to",
  "was",
  "will",
  "with",
];

const SearchQueryHighlightedContent = (props: ISearchQueryContentProps) => {
  const { content, searchQueryText, nameForKey, className, searchQueryClassName, onClickFunc, to } = props;

  if (!searchQueryText || !content) {
    return <span className={className}>{content}</span>;
  }

  const splitContentArray = content.split(" ");
  const filteredContentArray = splitContentArray.filter(word => !STOP_WORDS.includes(word));
  const upperCaseSearchQueryText = searchQueryText.toUpperCase();
  const splitSearchQueryTextArray = upperCaseSearchQueryText.split(" ");

  const searchQueryHighlightedContent = filteredContentArray.map((splitContent: string, index: number) => {
    const addedSpace = addSpaceIfNotFirstContent(index);
    const upperCaseSplitContent = splitContent.toUpperCase();
    const isContentExistAtSearchQueryArray = splitSearchQueryTextArray.indexOf(upperCaseSplitContent) !== -1;
    if (isContentExistAtSearchQueryArray) {
      return (
        <span key={`${nameForKey}_${index}`} className={searchQueryClassName}>
          {`${addedSpace}${splitContent}`}
        </span>
      );
    }

    let partMatchedSearchQueryTextLength: number;
    let contentPartSearchQueryIndex: number;
    const isPartContentExistAtSearchQueryArray = splitSearchQueryTextArray.some((searchQueryText: string) => {
      const isContentPartExistAtSearchQuery = upperCaseSplitContent.search(searchQueryText) !== -1;
      if (isContentPartExistAtSearchQuery) {
        const wordRegex = new RegExp("^" + searchQueryText + "$");
        contentPartSearchQueryIndex = upperCaseSplitContent.search(wordRegex);
        partMatchedSearchQueryTextLength = searchQueryText.length;
        return true;
      } else {
        return false;
      }
    });

    if (isPartContentExistAtSearchQueryArray) {
      const partHighlightedStartIndex = contentPartSearchQueryIndex;
      const partHighlightedEndIndex = contentPartSearchQueryIndex + partMatchedSearchQueryTextLength;

      return (
        <span key={`${nameForKey}_${index}`}>
          <span>{`${addedSpace}${splitContent.substring(0, partHighlightedStartIndex)}`}</span>
          <span className={searchQueryClassName}>
            {splitContent.substring(contentPartSearchQueryIndex, partHighlightedEndIndex)}
          </span>
          <span>{splitContent.substring(partHighlightedEndIndex)}</span>
        </span>
      );
    } else {
      return <span key={`${nameForKey}_${index}`}>{`${addedSpace}${splitContent}`}</span>;
    }
  });

  if (!!to) {
    return (
      <Link to={to} style={!!onClickFunc ? { cursor: "pointer" } : null} onClick={onClickFunc} className={className}>
        {searchQueryHighlightedContent}
      </Link>
    );
  } else {
    return (
      <span style={!!onClickFunc ? { cursor: "pointer" } : null} onClick={onClickFunc} className={className}>
        {searchQueryHighlightedContent}
      </span>
    );
  }
};

function addSpaceIfNotFirstContent(index: number) {
  const shouldHaveSpace = index !== 0;
  if (shouldHaveSpace) {
    return " ";
  } else {
    return "";
  }
}

export default SearchQueryHighlightedContent;
