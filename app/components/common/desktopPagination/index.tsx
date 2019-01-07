import * as React from "react";
import { range } from "lodash";
import * as classNames from "classnames";
import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { LocationDescriptor } from "../../../../node_modules/@types/history";
import { trackEvent } from "../../../helpers/handleGA";
const styles = require("./desktopPagination.scss");

interface CommonPaginationProps
  extends Readonly<{
      type: string;
      currentPageIndex: number;
      totalPage: number;
      itemStyle?: React.CSSProperties;
      wrapperStyle?: React.CSSProperties;
    }> {}

interface LinkPaginationProps
  extends CommonPaginationProps,
    Readonly<{
      getLinkDestination: (page: number) => LocationDescriptor;
    }> {}

export interface EventPaginationProps
  extends CommonPaginationProps,
    Readonly<{
      onItemClick: (page: number) => void;
    }> {}

type DesktopPaginationProps = LinkPaginationProps | EventPaginationProps;

function isLinkPagination(props: DesktopPaginationProps): props is LinkPaginationProps {
  return (props as LinkPaginationProps).getLinkDestination !== undefined;
}

export function makePageNumberArray(props: DesktopPaginationProps): number[] {
  const totalPage = props.totalPage;
  const currentPage = props.currentPageIndex + 1;

  let startPage: number;
  let endPage: number;

  if (currentPage - 5 < 1) {
    startPage = 1;
    endPage = totalPage >= 10 ? 10 + 1 : totalPage + 1;
  } else if (totalPage > currentPage + 5) {
    startPage = currentPage - 5;
    endPage = currentPage + 5;
  } else {
    startPage = totalPage - 9;
    endPage = totalPage + 1;
  }

  return range(startPage, endPage);
}

function getFirstPageIcon(props: DesktopPaginationProps) {
  if (props.currentPageIndex === 0) {
    return null;
  }

  if (isLinkPagination(props)) {
    return (
      <Link to={(props as LinkPaginationProps).getLinkDestination(1)} className={styles.pageIconButton}>
        <Icon icon="LAST_PAGE" />
      </Link>
    );
  } else {
    return (
      <span onClick={() => (props as EventPaginationProps).onItemClick(1)} className={styles.pageIconButton}>
        <Icon icon="LAST_PAGE" />
      </span>
    );
  }
}

function getNextIcon(props: DesktopPaginationProps) {
  if (props.currentPageIndex + 1 === props.totalPage || props.totalPage === 0) {
    return null;
  }

  if (isLinkPagination(props)) {
    return (
      <div className={styles.nextButtons}>
        <Link
          to={(props as LinkPaginationProps).getLinkDestination(props.currentPageIndex + 2)}
          className={styles.pageIconButton}
        >
          <Icon icon="NEXT_PAGE" />
        </Link>
      </div>
    );
  } else {
    return (
      <div className={styles.nextButtons}>
        <span
          onClick={() => (props as EventPaginationProps).onItemClick(props.currentPageIndex + 2)}
          className={styles.pageIconButton}
        >
          <Icon icon="NEXT_PAGE" />
        </span>
      </div>
    );
  }
}

function getPrevIcon(props: DesktopPaginationProps) {
  if (props.currentPageIndex === 0) {
    return null;
  }

  if (isLinkPagination(props)) {
    return (
      <Link
        to={(props as LinkPaginationProps).getLinkDestination(props.currentPageIndex)}
        className={styles.pageIconButton}
      >
        <Icon icon="NEXT_PAGE" />
      </Link>
    );
  } else {
    return (
      <span
        onClick={() => (props as EventPaginationProps).onItemClick(props.currentPageIndex)}
        className={styles.pageIconButton}
      >
        <Icon icon="NEXT_PAGE" />
      </span>
    );
  }
}

const getEventPageItem = (props: EventPaginationProps, pageNumber: number, currentPage: number) => {
  return (
    <span
      onClick={() => {
        props.onItemClick(pageNumber);
        trackEvent({ category: "Search", action: "Pagination", label: `${pageNumber}` });
      }}
      key={`${props.type}_${pageNumber}`}
      style={props.itemStyle}
      className={classNames({
        [`${styles.pageItem}`]: true,
        [`${styles.active}`]: pageNumber === currentPage,
      })}
    >
      {pageNumber}
    </span>
  );
};

const getLinkPageItem = (props: LinkPaginationProps, pageNumber: number, currentPage: number) => {
  return (
    <Link
      onClick={() => {
        trackEvent({ category: "Search", action: "Pagination", label: `${pageNumber}` });
      }}
      to={props.getLinkDestination(pageNumber)}
      style={props.itemStyle}
      key={`${props.type}_${pageNumber}`}
      className={classNames({
        [`${styles.pageItem}`]: true,
        [`${styles.active}`]: currentPage === pageNumber,
      })}
    >
      {pageNumber}
    </Link>
  );
};

const DesktopPagination = (props: DesktopPaginationProps) => {
  const pageNumberArray = makePageNumberArray(props);
  const pageNodes = pageNumberArray.map(pageNumber => {
    if (isLinkPagination(props)) {
      return getLinkPageItem(props, pageNumber, props.currentPageIndex + 1);
    } else {
      return getEventPageItem(props, pageNumber, props.currentPageIndex + 1);
    }
  });

  return (
    <div style={props.wrapperStyle} className={styles.paginationWrapper}>
      <div className={styles.prevButtons}>
        {getFirstPageIcon(props)}
        {getPrevIcon(props)}
      </div>
      {pageNodes}
      {getNextIcon(props)}
    </div>
  );
};

export default withStyles<typeof DesktopPagination>(styles)(DesktopPagination);
