import * as React from "react";
import * as _ from "lodash";
import * as classNames from "classnames";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
const styles = require("./commonPagination.scss");

interface CommonPaginationProps {
  type: string; // This is needed for React reiteration key.
  currentPageIndex: number;
  totalPage: number;
  onItemClick: (targetPageIndex: number) => void;
  itemStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
}

function makePageIndexArray(props: CommonPaginationProps): number[] {
  const totalPageIndex = props.totalPage - 1;
  let startPageIndex: number;
  let endPageIndex: number;

  const isShowAllPage = props.totalPage <= 10;
  if (isShowAllPage) {
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

  return _.range(startPageIndex + 1, endPageIndex + 2);
}

const CommonPagination = (props: CommonPaginationProps) => {
  const pageIndexArray = makePageIndexArray(props);
  const pageNodes = pageIndexArray.map((pageNumber, index) => {
    return (
      <span
        style={props.itemStyle}
        onClick={() => {
          props.onItemClick(pageNumber - 1);
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
  });

  const firstPageIcon =
    props.currentPageIndex !== 0 ? (
      <span onClick={() => props.onItemClick(0)} className={styles.pageIconButton}>
        <Icon icon="LAST_PAGE" />
      </span>
    ) : null;

  const prevIcon =
    props.currentPageIndex !== 0 ? (
      <span onClick={() => props.onItemClick(props.currentPageIndex - 1)} className={styles.pageIconButton}>
        <Icon icon="NEXT_PAGE" />
      </span>
    ) : null;

  const nextIcon =
    props.currentPageIndex + 1 !== props.totalPage && props.totalPage !== 0 ? (
      <div className={styles.nextButtons}>
        <span onClick={() => props.onItemClick(props.currentPageIndex + 1)} className={styles.pageIconButton}>
          <Icon icon="NEXT_PAGE" />
        </span>
      </div>
    ) : null;

  return (
    <div style={props.wrapperStyle} className={styles.paginationWrapper}>
      <div className={styles.prevButtons}>
        {firstPageIcon}
        {prevIcon}
      </div>
      {pageNodes}
      {nextIcon}
    </div>
  );
};

export default withStyles<typeof CommonPagination>(styles)(CommonPagination);
