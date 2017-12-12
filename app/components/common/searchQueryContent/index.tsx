import * as React from "react";

interface ISearchQueryContentParams {
  content: string;
  searchQuery: string;
  nameForKey: string;
  className?: string;
  searchQueryClassName?: string;
}

const SearchQueryContent = ({
  content,
  searchQuery,
  nameForKey,
  className,
  searchQueryClassName,
}: ISearchQueryContentParams) => {
  let currentIndex = 0;
  let parsingIndex = 0;
  let indexArray: number[] = [0];

  while (parsingIndex !== -1) {
    parsingIndex = content.slice(currentIndex, content.length - 1).indexOf(searchQuery);
    if (parsingIndex !== -1) {
      indexArray.push(currentIndex + parsingIndex);
      indexArray.push(currentIndex + parsingIndex + searchQuery.length);
      currentIndex = currentIndex + parsingIndex + searchQuery.length;
    }
  }

  const searchQueryContent = indexArray.map((val: number, index: number, array: number[]) => {
    let nextVal;
    if (index + 1 <= array.length) {
      nextVal = array[index + 1];
    } else {
      nextVal = content.length - 1;
    }

    if (index % 2 === 0) {
      return <span key={`title_${index}`}>{content.slice(val, nextVal)}</span>;
    } else {
      return (
        <span key={`${nameForKey}_${index}`} className={searchQueryClassName}>
          {content.slice(val, val + searchQuery.length)}
        </span>
      );
    }
  });

  return <span className={className}>{searchQueryContent}</span>;
};

export default SearchQueryContent;
