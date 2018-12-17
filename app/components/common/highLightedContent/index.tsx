import * as React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./highLightedContent.scss");

interface HighLightContentProps {
  handelExtendContent?: () => void;
  originContent?: string;
  content: string;
  isExtendContent?: boolean;
  highLightContent: string | null;
  className?: string;
  onClickFunc?: () => void;
  href?: string;
  to?: string | object;
  exactHighlight?: boolean;
  maxCharLimit?: number | undefined;
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

const HighLightedContent = (props: HighLightContentProps) => {
  const {
    highLightContent,
    className,
    onClickFunc,
    to,
    handelExtendContent,
    isExtendContent,
    originContent,
    content,
    maxCharLimit,
  } = props;
  const finalAbstract = isExtendContent ? originContent : content;

  if (!finalAbstract) {
    return <span className={className}>{finalAbstract}</span>;
  }

  if (!!to) {
    return (
      <Link to={to} style={onClickFunc ? { cursor: "pointer" } : {}} onClick={onClickFunc} className={className}>
        {!highLightContent ? (
          <span>{finalAbstract}</span>
        ) : (
          <span dangerouslySetInnerHTML={createMarkup(getHighlightedContent(finalAbstract, highLightContent))} />
        )}
      </Link>
    );
  } else {
    return (
      <span style={onClickFunc ? { cursor: "pointer" } : {}} onClick={onClickFunc} className={className}>
        {!highLightContent ? (
          <span>{finalAbstract}</span>
        ) : (
          <span dangerouslySetInnerHTML={createMarkup(getHighlightedContent(finalAbstract, highLightContent))} />
        )}

        {typeof maxCharLimit !== "undefined" && finalAbstract.length > maxCharLimit ? (
          <label className={styles.moreOrLess} onClick={handelExtendContent}>
            {isExtendContent ? <span>less</span> : <span>more</span>}
          </label>
        ) : null}
      </span>
    );
  }
};

export default withStyles<typeof HighLightedContent>(styles)(HighLightedContent);
