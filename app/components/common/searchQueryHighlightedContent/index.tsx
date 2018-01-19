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
  const splitedSearchQueryTextArray = searchQueryText.split(" ");

  const searchQueryHighlightedContent = splitedContentArray.map((splitedContent: string, index: number) => {
    let spanContent = addSpaceIfNotFirstContent(splitedContent, index);

    const isContentExistAtSearchQueryArray = splitedSearchQueryTextArray.indexOf(splitedContent) !== -1;
    if (isContentExistAtSearchQueryArray) {
      return (
        <span key={`${nameForKey}_${index}`} className={searchQueryClassName}>
          {spanContent}
        </span>
      );
    }

    let partMatchedSearchQueryTextLength: number;
    let contentPartSearchQueryIndex: number;
    const isPartContentExistAtSearchQueryArray = splitedSearchQueryTextArray.some((searchQueryText: string) => {
      contentPartSearchQueryIndex = splitedContent.search(searchQueryText);
      const isContentPartExistAtSearchQuery = splitedContent.search(searchQueryText) !== -1;
      if (isContentPartExistAtSearchQuery) {
        partMatchedSearchQueryTextLength = searchQueryText.length;
        return true;
      } else {
        return false;
      }
    });

    if (isPartContentExistAtSearchQueryArray) {
      return (
        <span key={`${nameForKey}_${index}`}>
          <span>{spanContent.substring(0, contentPartSearchQueryIndex)}</span>
          <span className={searchQueryClassName}>
            {spanContent.substring(
              contentPartSearchQueryIndex,
              contentPartSearchQueryIndex + partMatchedSearchQueryTextLength,
            )}
          </span>
          <span>{spanContent.substring(contentPartSearchQueryIndex + partMatchedSearchQueryTextLength)}</span>
        </span>
      );
    } else {
      return <span key={`${nameForKey}_${index}`}>{spanContent}</span>;
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

function addSpaceIfNotFirstContent(content: string, index: number) {
  const shouldHaveSpace = index !== 0;
  if (shouldHaveSpace) {
    return ` ${content}`;
  } else {
    return content;
  }
}

export default SearchQueryHighlightedContent;
