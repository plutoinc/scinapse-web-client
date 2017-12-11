import * as React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../../icons";
const styles = require("./pagination.scss");

export interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  searchQueryParam: string;
}

const Pagination = (props: IPaginationProps) => {
  let startPage: number;
  let endPage: number;

  if (props.totalPages <= 10) {
    // less than 10 total pages so show all
    startPage = 1;
    endPage = props.totalPages;
  } else {
    if (props.currentPage <= 6) {
      startPage = 1;
      endPage = 10;
    } else if (props.currentPage + 4 >= props.totalPages) {
      startPage = props.totalPages - 9;
      endPage = props.totalPages;
    } else {
      startPage = props.currentPage - 5;
      endPage = props.currentPage + 4;
    }
  }

  const pageRange = Array.from(Array(endPage - startPage + 1).keys()).map(i => i + startPage);

  return (
    <div className={styles.pagination}>
      {props.currentPage !== 0 ? (
        <div className={styles.prevButtons}>
          <Link to={`/search?query=${props.searchQueryParam}&page=1`} className={styles.pageIconButton}>
            <Icon icon="LAST_PAGE" />
          </Link>
          <Link
            to={`/search?query=${props.searchQueryParam}&page=${props.currentPage - 1}`}
            className={styles.pageIconButton}
          >
            <Icon icon="NEXT_PAGE" />
          </Link>
        </div>
      ) : null}
      {pageRange.map((page, index) => (
        <Link
          to={`/search?query=${props.searchQueryParam}&page=${page}`}
          key={`page_${index}`}
          className={page === props.currentPage ? `${styles.pageItem} ${styles.active}` : styles.pageItem}
        >
          {page}
        </Link>
      ))}
      {props.currentPage !== props.totalPages - 1 ? (
        <div className={styles.nextButtons}>
          <Link
            to={`/search?query=${props.searchQueryParam}&page=${props.currentPage + 1}`}
            className={styles.pageIconButton}
          >
            <Icon icon="NEXT_PAGE" />
          </Link>
          <Link
            to={`/search?query=${props.searchQueryParam}&page=${props.totalPages}`}
            className={styles.pageIconButton}
          >
            <Icon icon="LAST_PAGE" />
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default Pagination;
