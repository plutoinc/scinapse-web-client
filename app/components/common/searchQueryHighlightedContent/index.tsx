import * as React from "react";

interface ISearchQueryContentProps {
  content: string;
  searchQueryText: string;
  nameForKey: string;
  className?: string;
  searchQueryClassName?: string;
  onClickFunc?: () => void;
  href?: string;
}

const SearchQueryHighlightedContent = (props: ISearchQueryContentProps) => {
  const { content, searchQueryText, nameForKey, className, searchQueryClassName, onClickFunc, href } = props;

  if (!searchQueryText || !content) {
    return <span className={className}>{content}</span>;
  }

  const splitedContentArray = content.split(" ");
  const upperCaseSearchQueryText = searchQueryText.toUpperCase();
  const splitedSearchQueryTextArray = upperCaseSearchQueryText.split(" ");

  const searchQueryHighlightedContent = splitedContentArray.map((splitedContent: string, index: number) => {
    const addedSpace = addSpaceIfNotFirstContent(index);
    const upperCaseSplitedContent = splitedContent.toUpperCase();
    const isContentExistAtSearchQueryArray = splitedSearchQueryTextArray.indexOf(upperCaseSplitedContent) !== -1;
    if (isContentExistAtSearchQueryArray) {
      return (
        <span key={`${nameForKey}_${index}`} className={searchQueryClassName}>
          {`${addedSpace}${splitedContent}`}
        </span>
      );
    }

    let partMatchedSearchQueryTextLength: number;
    let contentPartSearchQueryIndex: number;
    const isPartContentExistAtSearchQueryArray = splitedSearchQueryTextArray.some((searchQueryText: string) => {
      const isContentPartExistAtSearchQuery = upperCaseSplitedContent.search(searchQueryText) !== -1;
      if (isContentPartExistAtSearchQuery) {
        contentPartSearchQueryIndex = upperCaseSplitedContent.search(searchQueryText);
        partMatchedSearchQueryTextLength = searchQueryText.length;
        return true;
      } else {
        return false;
      }
    });

    if (isPartContentExistAtSearchQueryArray) {
      const partHighlightedStartIndex = contentPartSearchQueryIndex + 1;
      const partHighlightedEndIndex = contentPartSearchQueryIndex + partMatchedSearchQueryTextLength + 1;

      return (
        <span key={`${nameForKey}_${index}`}>
          <span>{`${addedSpace}${splitedContent.substring(0, contentPartSearchQueryIndex)}`}</span>
          <span className={searchQueryClassName}>
            {splitedContent.substring(
              contentPartSearchQueryIndex,
              contentPartSearchQueryIndex + partMatchedSearchQueryTextLength,
            )}
          </span>
          <span>{splitedContent.substring(contentPartSearchQueryIndex + partMatchedSearchQueryTextLength)}</span>
        </span>
      );
    } else {
      return <span key={`${nameForKey}_${index}`}>{`${addedSpace}${splitedContent}`}</span>;
    }
  });

  const isHrefExist = !!href;
  if (isHrefExist) {
    return (
      <a
        href={href}
        target="_blank"
        style={!!onClickFunc ? { cursor: "pointer" } : null}
        onClick={onClickFunc}
        className={className}
      >
        {searchQueryHighlightedContent}
      </a>
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
