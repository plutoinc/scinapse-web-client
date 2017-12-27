import * as React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../../icons";
import papersQueryFormatter from "../../../../helpers/papersQueryFormatter";
const styles = require("./pagination.scss");

export interface IPaginationProps {
  totalPageCount: number;
  currentPageIndex: number;
  searchQueryText: string;
}

const Pagination = (props: IPaginationProps) => {
  let startPageIndex: number;
  let endPageIndex: number;
  const totalPageIndex: number = props.totalPageCount - 1;

  if (props.totalPageCount <= 10) {
    // less than 10 total pages so show all
    startPageIndex = 0;
    endPageIndex = totalPageIndex;
  } else {
    if (props.currentPageIndex <= 6) {
      startPageIndex = 0;
      endPageIndex = 9;
    } else if (props.currentPageIndex + 4 >= totalPageIndex) {
      startPageIndex = totalPageIndex - 9;
      endPageIndex = totalPageIndex;
    } else {
      startPageIndex = props.currentPageIndex - 5;
      endPageIndex = props.currentPageIndex + 4;
    }
  }

  const pageRangeIndexArray = Array.from(Array(endPageIndex - startPageIndex + 1).keys()).map(i => i + startPageIndex);

  return (
    <div className={styles.pagination}>
      {props.currentPageIndex !== 0 ? (
        <div className={styles.prevButtons}>
          <Link
            to={`/search?query=${papersQueryFormatter.formatPapersQuery({ text: props.searchQueryText })}&page=1`}
            className={styles.pageIconButton}
          >
            <Icon icon="LAST_PAGE" />
          </Link>
          <Link
            to={`/search?query=${papersQueryFormatter.formatPapersQuery({ text: props.searchQueryText })}&page=${
              props.currentPageIndex
            }`}
            className={styles.pageIconButton}
          >
            <Icon icon="NEXT_PAGE" />
          </Link>
        </div>
      ) : null}
      {pageRangeIndexArray.map((page, index) => (
        <Link
          to={`/search?query=${papersQueryFormatter.formatPapersQuery({
            text: props.searchQueryText,
          })}&page=${page + 1}`}
          key={`page_${index}`}
          className={page === props.currentPageIndex ? `${styles.pageItem} ${styles.active}` : styles.pageItem}
        >
          {page + 1}
        </Link>
      ))}
      {props.currentPageIndex !== totalPageIndex ? (
        <div className={styles.nextButtons}>
          <Link
            to={`/search?query=${papersQueryFormatter.formatPapersQuery({
              text: props.searchQueryText,
            })}&page=${props.currentPageIndex + 2}`}
            className={styles.pageIconButton}
          >
            <Icon icon="NEXT_PAGE" />
          </Link>
          {/* Below line has to be blocked because of backEnd quality*/}
          {/* <Link
            to={`/search?query=${papersFilterQueryFormatter.formatPapersQuery({text:props.searchQueryParam})}&page=${totalPageIndex + 1}`}
            className={styles.pageIconButton}
          >
            <Icon icon="LAST_PAGE" />
          </Link> */}
        </div>
      ) : null}
    </div>
  );
};

export default Pagination;
