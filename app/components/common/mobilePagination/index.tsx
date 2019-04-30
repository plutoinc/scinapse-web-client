import * as React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
import { LocationDescriptor } from "../../../../node_modules/@types/history";
import { blockUnverifiedUser, AUTH_LEVEL } from "../../../helpers/checkAuthDialog";
const styles = require("./pagination.scss");

interface PaginationProps
  extends RouteComponentProps,
    Readonly<{
      totalPageCount: number;
      currentPageIndex: number;
      wrapperStyle?: React.CSSProperties;
    }> {}

interface LinkPaginationProps
  extends PaginationProps,
    Readonly<{
      getLinkDestination: (page: number) => LocationDescriptor;
    }> {}

interface EventPaginationProps
  extends PaginationProps,
    Readonly<{
      onItemClick: (page: number) => void;
    }> {}

type MobilePaginationProps = LinkPaginationProps | EventPaginationProps;

function isLinkPagination(props: MobilePaginationProps): props is LinkPaginationProps {
  return (props as LinkPaginationProps).getLinkDestination !== undefined;
}

function isEventPagination(props: MobilePaginationProps): props is EventPaginationProps {
  return (props as EventPaginationProps).onItemClick !== undefined;
}

function getEventLinkButton(props: EventPaginationProps) {
  const indexOfMaxPage = props.totalPageCount - 1;

  if (props.currentPageIndex === 0) {
    return (
      <span
        onClick={async e => {
          e.preventDefault();

          const isBlocked = await blockUnverifiedUser({
            authLevel: AUTH_LEVEL.VERIFIED,
            actionArea: "searchResult",
            actionLabel: "nextPageFromSearch",
            userActionType: "nextPageFromSearch",
          });

          if (isBlocked) {
            return;
          } else {
            props.onItemClick(2);
          }
        }}
        className={styles.pageButton}
      >
        Next page
      </span>
    );
  } else if (props.currentPageIndex === indexOfMaxPage) {
    return (
      <div className={styles.pageButton}>
        <span
          onClick={() => {
            props.onItemClick(1);
          }}
        >
          <Icon className={`${styles.pageIcon} ${styles.prevButton}`} icon="LAST_PAGE" />
        </span>
        <span>{`${props.currentPageIndex + 1} Page`}</span>
      </div>
    );
  } else {
    return (
      <div className={styles.pageButton}>
        <span
          className={styles.pageIconWrapper}
          onClick={() => {
            props.onItemClick(1);
          }}
        >
          <Icon className={`${styles.pageIcon} ${styles.prevButton}`} icon="LAST_PAGE" />
        </span>
        <span
          className={styles.pageIconWrapper}
          onClick={() => {
            props.onItemClick(props.currentPageIndex);
          }}
        >
          <Icon className={`${styles.pageIcon} ${styles.prevButton}`} icon="NEXT_PAGE" />
        </span>
        <span className={styles.pageNumber}>{`${props.currentPageIndex + 1} Page`}</span>
        <span
          className={styles.pageIconWrapper}
          onClick={() => {
            props.onItemClick(props.currentPageIndex + 2);
          }}
        >
          <Icon className={styles.pageIcon} icon="NEXT_PAGE" />
        </span>
      </div>
    );
  }
}

function getLinkButton(props: LinkPaginationProps) {
  const indexOfMaxPage = props.totalPageCount - 1;

  if (props.currentPageIndex === 0) {
    return (
      <Link
        onClick={async e => {
          e.preventDefault();

          const isBlocked = await blockUnverifiedUser({
            authLevel: AUTH_LEVEL.VERIFIED,
            actionArea: "searchResult",
            actionLabel: "nextPageFromSearch",
            userActionType: "nextPageFromSearch",
          });

          if (isBlocked) {
            return;
          }

          props.history.push(`${props.getLinkDestination(2)}`);
        }}
        to={props.getLinkDestination(2)}
        className={styles.pageButton}
      >
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
    return (
      <div style={props.wrapperStyle} className={styles.buttonWrapper}>
        {getLinkButton(props)}
      </div>
    );
  } else if (isEventPagination(props)) {
    return (
      <div style={props.wrapperStyle} className={styles.buttonWrapper}>
        {getEventLinkButton(props)}
      </div>
    );
  } else {
    return null;
  }
};

export default withRouter(withStyles<typeof MobilePagination>(styles)(MobilePagination));
