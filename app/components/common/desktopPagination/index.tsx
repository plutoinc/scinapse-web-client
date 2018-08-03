import * as React from "react";
import { range } from "lodash";
import * as classNames from "classnames";
import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { LocationDescriptor } from "../../../../node_modules/@types/history";
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

interface EventPaginationProps
  extends CommonPaginationProps,
    Readonly<{
      onItemClick: (page: number) => void;
    }> {}

type DesktopPaginationProps = LinkPaginationProps | EventPaginationProps;

function isLinkPagination(props: DesktopPaginationProps): props is LinkPaginationProps {
  return (props as LinkPaginationProps).getLinkDestination !== undefined;
}

function makePageIndexArray(props: DesktopPaginationProps): number[] {
  const totalPageIndex = props.totalPage - 1;
  let startPageIndex: number;
  let endPageIndex: number;

  const lessThan10Pages = props.totalPage <= 10;
  if (lessThan10Pages) {
    startPageIndex = 0;
    endPageIndex = totalPageIndex;
  } else {
    const isExistNextFourPageAfterTotalPages = props.currentPageIndex + 4 >= totalPageIndex;
    if (props.currentPageIndex <= 6) {
      startPageIndex = 0;
      endPageIndex = 9;
    } else if (isExistNextFourPageAfterTotalPages) {
      startPageIndex = totalPageIndex - 9;
      endPageIndex = totalPageIndex;
    } else {
      startPageIndex = props.currentPageIndex - 5;
      endPageIndex = props.currentPageIndex + 4;
    }
  }

  return range(startPageIndex + 1, endPageIndex + 2);
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

const getEventPageItem = (props: EventPaginationProps, pageNumber: number, index: number) => {
  return (
    <span
      style={props.itemStyle}
      onClick={() => {
        props.onItemClick(pageNumber);
      }}
      key={`${props.type}_${index}`}
      className={classNames({
        [`${styles.pageItem}`]: true,
        [`${styles.active}`]: index === props.currentPageIndex,
      })}
    >
      {pageNumber}
    </span>
  );
};

const getLinkPageItem = (props: LinkPaginationProps, pageNumber: number, index: number) => {
  return (
    <Link
      to={props.getLinkDestination(pageNumber)}
      style={props.itemStyle}
      key={`${props.type}_${index}`}
      className={classNames({
        [`${styles.pageItem}`]: true,
        [`${styles.active}`]: index === props.currentPageIndex,
      })}
    >
      {pageNumber}
    </Link>
  );
};

const DesktopPagination = (props: DesktopPaginationProps) => {
  const pageIndexArray = makePageIndexArray(props);
  const pageNodes = pageIndexArray.map((pageNumber, index) => {
    if (isLinkPagination(props)) {
      return getLinkPageItem(props, pageNumber, index);
    } else {
      return getEventPageItem(props, pageNumber, index);
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
