import * as React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import { formulaeToHTMLStr } from "../../../helpers/displayFormula";
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
    .trim()
    .split(" ")
    .filter(word => !STOP_WORDS.includes(word))
    .map(word => word.trim());
}

export function getHighlightedContent(content: string, highlightText: string) {
  const highlightWords = getWordsArraySplitBySpaceWithoutStopWords(highlightText);

  return content
    .split(" ")
    .map(word => word.trim())
    .map(contentWord => {
      const matchWord = highlightWords.find(highlightWord =>
        contentWord.toLowerCase().startsWith(highlightWord.toLowerCase())
      );
      if (matchWord) {
        return `<b>${contentWord.slice(0, matchWord.length)}</b>${contentWord.slice(matchWord.length) || ""}`;
      } else {
        return contentWord;
      }
    })
    .join(" ");
}

function createLatexParsedMarkup(rawHTML: string) {
  return { __html: formulaeToHTMLStr(rawHTML) };
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
          <span
            dangerouslySetInnerHTML={createLatexParsedMarkup(getHighlightedContent(finalAbstract, highLightContent))}
          />
        )}
      </Link>
    );
  } else {
    return (
      <span style={onClickFunc ? { cursor: "pointer" } : {}} onClick={onClickFunc} className={className}>
        {!highLightContent ? (
          <span>{finalAbstract}</span>
        ) : (
          <span
            dangerouslySetInnerHTML={createLatexParsedMarkup(getHighlightedContent(finalAbstract, highLightContent))}
          />
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
