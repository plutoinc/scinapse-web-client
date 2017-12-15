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
  // Firstly, under code is for finding searchQuery and storing that information to indexArray.

  let currentIndex = 0; // index for indicating current Index
  let parsingIndex = 0; // index for searching Query
  /* array for storing index,
  At odd, it will store next index of not searchQuery
  At even, it will store next index of searchQuery first index */
  let indexArray: number[] = [0];

  // for searching regardless of upper, lower case
  const upperCaseContent = content.toUpperCase();
  const upperCaseSearchQuery = searchQuery.toUpperCase();

  while (parsingIndex !== -1) {
    // if searchQuery does not more exist, it will stop.
    parsingIndex = upperCaseContent.slice(currentIndex, content.length - 1).indexOf(upperCaseSearchQuery);

    if (parsingIndex !== -1) {
      indexArray.push(currentIndex + parsingIndex); // searchQuery first index is pushed
      indexArray.push(currentIndex + parsingIndex + upperCaseSearchQuery.length); // next index of not searchQuery is pushed
      currentIndex = currentIndex + parsingIndex + upperCaseSearchQuery.length; // currentIndex moves to next to parsingIndex.
    }
  }

  // This is Element[] for showing bold keyword.
  const searchQueryContent = indexArray.map((val: number, index: number, array: number[]) => {
    let nextVal; // Check for if is not last element.
    if (index + 1 <= array.length) {
      // if not, next Value is for expressing string.
      nextVal = array[index + 1];
    } else {
      // If it is, next Value is the last Index.
      nextVal = content.length - 1;
    }

    if (index % 2 === 0) {
      return <span key={`${nameForKey}_${index}`}>{content.slice(val, nextVal)}</span>;
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
