import * as React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
import { LocationDescriptor } from "../../../../node_modules/@types/history";
const styles = require("./pagination.scss");

interface PaginationProps
  extends Readonly<{
      totalPageCount: number;
      currentPageIndex: number;
    }> {}

interface LinkPaginationProps
  extends PaginationProps,
    Readonly<{
      getLinkDestination: (page: number) => LocationDescriptor;
    }> {}

interface EventPaginationProps
  extends PaginationProps,
    Readonly<{
      onItemClick: (targetPageIndex: number) => void;
    }> {}

type MobilePaginationProps = LinkPaginationProps | EventPaginationProps;

function isLinkPagination(props: MobilePaginationProps): props is LinkPaginationProps {
  return (props as LinkPaginationProps).getLinkDestination !== undefined;
}

function getLinkButton(props: LinkPaginationProps) {
  const indexOfMaxPage = props.totalPageCount - 1;

  if (props.currentPageIndex === 0) {
    return (
      <Link to={props.getLinkDestination(2)} className={styles.pageButton}>
        Next page
      </Link>
    );
  } else if (props.currentPageIndex === indexOfMaxPage) {
    return (
      <div className={styles.pageButton}>
        <Link to={props.getLinkDestination(1)}>
          <Icon className={`${styles.pageIcon} ${styles.prevButton}`} icon="LAST_PAGE" />
        </Link>
        <span>{`${props.currentPageIndex + 1} Page`}</span>
      </div>
    );
  } else {
    return (
      <div className={styles.pageButton}>
        <Link className={styles.pageIconWrapper} to={props.getLinkDestination(1)}>
          <Icon className={`${styles.pageIcon} ${styles.prevButton}`} icon="LAST_PAGE" />
        </Link>
        <Link className={styles.pageIconWrapper} to={props.getLinkDestination(props.currentPageIndex)}>
          <Icon className={`${styles.pageIcon} ${styles.prevButton}`} icon="NEXT_PAGE" />
        </Link>
        <span className={styles.pageNumber}>{`${props.currentPageIndex + 1} Page`}</span>
        <Link className={styles.pageIconWrapper} to={props.getLinkDestination(props.currentPageIndex + 2)}>
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

  if (isLinkPagination(props)) {
    return <div className={styles.buttonWrapper}>{getLinkButton(props)}</div>;
  } else {
    return null;
  }

};

export default withStyles<typeof MobilePagination>(styles)(MobilePagination);
