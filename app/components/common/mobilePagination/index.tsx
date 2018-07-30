import * as React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../icons";
import { getLinkQueryParams } from "../../articleSearch/components/pagination";
import { withStyles } from "../../../helpers/withStylesHelper";
import { ParsedSearchPageQueryObject } from "../../../helpers/papersQueryFormatter";
const styles = require("./pagination.scss");

export interface MobilePaginationProps {
  totalPageCount: number;
  currentPageIndex: number;
  searchQueryObj: ParsedSearchPageQueryObject;
}

function getButton(props: MobilePaginationProps) {
  const indexOfMaxPage = props.totalPageCount - 1;

  if (props.currentPageIndex === 0) {
    return (
      <Link
        to={`/search?${getLinkQueryParams(props, 2)}`}
        className={styles.pageButton}
      >
        Next page
      </Link>
    );
  } else if (props.currentPageIndex === indexOfMaxPage) {
    return (
      <div className={styles.pageButton}>
        <Link to={`/search?${getLinkQueryParams(props, 1)}`}>
          <Icon
            className={`${styles.pageIcon} ${styles.prevButton}`}
            icon="LAST_PAGE"
          />
        </Link>
        <span>{`${props.currentPageIndex + 1} Page`}</span>
      </div>
    );
  } else {
    return (
      <div className={styles.pageButton}>
        <Link
          className={styles.pageIconWrapper}
          to={`/search?${getLinkQueryParams(props, 1)}`}
        >
          <Icon
            className={`${styles.pageIcon} ${styles.prevButton}`}
            icon="LAST_PAGE"
          />
        </Link>
        <Link
          className={styles.pageIconWrapper}
          to={`/search?${getLinkQueryParams(props, props.currentPageIndex)}`}
        >
          <Icon
            className={`${styles.pageIcon} ${styles.prevButton}`}
            icon="NEXT_PAGE"
          />
        </Link>
        <span className={styles.pageNumber}>{`${props.currentPageIndex +
          1} Page`}</span>
        <Link
          className={styles.pageIconWrapper}
          to={`/search?${getLinkQueryParams(
            props,
            props.currentPageIndex + 2,
          )}`}
        >
          <Icon className={styles.pageIcon} icon="NEXT_PAGE" />
        </Link>
      </div>
    );
  }
}

const MobilePagination = (props: MobilePaginationProps) => {
  if (!props.totalPageCount || props.totalPageCount === 1) {
    return null;
  }

  return <div className={styles.buttonWrapper}>{getButton(props)}</div>;
};

export default withStyles<typeof MobilePagination>(styles)(MobilePagination);
