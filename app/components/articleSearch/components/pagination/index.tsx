import * as React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../../icons";
import { trackSearch } from "../../../../helpers/handleGA";
import PapersQueryFormatter, { SearchQueryObj } from "../../../../helpers/papersQueryFormatter";
import { MobilePaginationProps } from "../mobile/pagination";

const styles = require("./pagination.scss");

export interface IPaginationProps {
  totalPageCount: number;
  currentPageIndex: number;
  searchQueryObj: SearchQueryObj;
}

export function getLinkQueryParams(props: IPaginationProps | MobilePaginationProps, page: number) {
  return PapersQueryFormatter.stringifyPapersQuery({
    query: props.searchQueryObj.query,
    filter: {
      yearFrom: props.searchQueryObj.yearFrom,
      yearTo: props.searchQueryObj.yearTo,
      journalIFFrom: props.searchQueryObj.journalIFFrom,
      journalIFTo: props.searchQueryObj.journalIFTo,
    },
    references: props.searchQueryObj.references,
    cited: props.searchQueryObj.cited,
    cognitiveId: props.searchQueryObj.cognitiveId,
    cognitive: props.searchQueryObj.cognitive,
    page,
  });
}

const Pagination = (props: IPaginationProps) => {
  const { totalPageCount, currentPageIndex } = props;

  const totalPageIndex: number = totalPageCount - 1;
  const pageRangeIndexArray = getPageRangeIndexArray(props);

  return (
    <div className={styles.pagination}>
      {currentPageIndex !== 0 ? (
        <div className={styles.prevButtons}>
          <Link
            to={`/search?${getLinkQueryParams(props, 1)}`}
            onClick={() => trackSearch("pagination", "1")}
            className={styles.pageIconButton}
          >
            <Icon icon="LAST_PAGE" />
          </Link>
          <Link
            to={`/search?${getLinkQueryParams(props, currentPageIndex)})}`}
            onClick={() => trackSearch("pagination", `${currentPageIndex}`)}
            className={styles.pageIconButton}
          >
            <Icon icon="NEXT_PAGE" />
          </Link>
        </div>
      ) : null}
      {pageRangeIndexArray.map((pageIndex, index) => (
        <Link
          to={`/search?${getLinkQueryParams(props, pageIndex + 1)})}`}
          onClick={() => trackSearch("pagination", `${pageIndex + 1}`)}
          key={`page_${index}`}
          className={pageIndex === currentPageIndex ? `${styles.pageItem} ${styles.active}` : styles.pageItem}
        >
          {pageIndex + 1}
        </Link>
      ))}
      {currentPageIndex !== totalPageIndex ? (
        <div className={styles.nextButtons}>
          <Link
            to={`/search?${getLinkQueryParams(props, currentPageIndex + 2)})}`}
            onClick={() => trackSearch("pagination", `${currentPageIndex + 2}`)}
            className={styles.pageIconButton}
          >
            <Icon icon="NEXT_PAGE" />
          </Link>
        </div>
      ) : null}
    </div>
  );
};

function getPageRangeIndexArray(props: IPaginationProps): number[] {
  const { totalPageCount, currentPageIndex } = props;
  const totalPageIndex: number = totalPageCount - 1;
  let startPageIndex: number;
  let endPageIndex: number;

  const isShowAllPage = totalPageCount <= 10;
  if (isShowAllPage) {
    startPageIndex = 0;
    endPageIndex = totalPageIndex;
  } else {
    const isExistNextFourPageAfterTotalPages = currentPageIndex + 4 >= totalPageIndex;
    if (currentPageIndex <= 6) {
      startPageIndex = 0;
      endPageIndex = 9;
    } else if (isExistNextFourPageAfterTotalPages) {
      startPageIndex = totalPageIndex - 9;
      endPageIndex = totalPageIndex;
    } else {
      startPageIndex = currentPageIndex - 5;
      endPageIndex = currentPageIndex + 4;
    }
  }

  const pageKeysArray = Array(endPageIndex - startPageIndex + 1).keys();
  return Array.from(pageKeysArray).map(i => i + startPageIndex);
}

export default Pagination;
