import * as React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../icons";

interface SearchQueryContentProps {
  handelExtendContent?: () => void;
  originContent?: string;
  content: string;
  isExtendContent?: boolean;
  searchQueryText: string | null;
  className?: string;
  onClickFunc?: () => void;
  href?: string;
  to?: string | object;
  exactHighlight?: boolean;
}

export const STOP_WORDS = [
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

export function getWordsArraySplitBySpaceWithoutStopWords(text: string) {
  return text
    .split(" ")
    .filter(word => !STOP_WORDS.includes(word))
    .map(word => word.trim());
}

export function getRegExpArray(targetTextArray: string[]) {
  return targetTextArray.map(text => new RegExp("^" + text + "$", "gi"));
}

export function getHighlightedContent(content: string, targetText: string) {
  const contentArray = content.split(" ").map(word => word.trim());
  const targetTextArray = getWordsArraySplitBySpaceWithoutStopWords(targetText);
  const targetTextRegExpArray = getRegExpArray(targetTextArray);

  return contentArray
    .map(contentWord => {
      if (targetTextRegExpArray.some(regExp => regExp.test(contentWord.replace(/\W/gi, "")))) {
        return `<b>${contentWord}</b>`;
      } else {
        return contentWord;
      }
    })
    .join(" ");
}

function createMarkup(rawHTML: string) {
  return { __html: rawHTML };
}

const SearchQueryHighlightedContent = (props: SearchQueryContentProps) => {
  const {
    searchQueryText,
    className,
    onClickFunc,
    to,
    handelExtendContent,
    isExtendContent,
    originContent,
    content,
  } = props;
  const finalAbstract = isExtendContent ? originContent : content;
  if (!searchQueryText || !finalAbstract) {
    return <span className={className}>{finalAbstract}</span>;
  }

  if (!!to) {
    return (
      <Link to={to} style={onClickFunc ? { cursor: "pointer" } : {}} onClick={onClickFunc} className={className}>
        {<span dangerouslySetInnerHTML={createMarkup(getHighlightedContent(finalAbstract, searchQueryText))} />}
      </Link>
    );
  } else {
    return (
      <span style={onClickFunc ? { cursor: "pointer" } : {}} onClick={onClickFunc} className={className}>
        {<span dangerouslySetInnerHTML={createMarkup(getHighlightedContent(finalAbstract, searchQueryText))} />}
        <label
          style={
            isExtendContent
              ? { width: "12px", height: "12px", float: "right", marginTop: "6px" }
              : { width: "12px", height: "12px", float: "right", marginTop: "14px", transform: "rotate(180deg)" }
          }
          onClick={handelExtendContent}
        >
          <Icon icon="ARROW_POINT_TO_DOWN" />
        </label>
        <hr />
      </span>
    );
  }
};

export default SearchQueryHighlightedContent;
