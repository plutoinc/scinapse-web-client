import * as React from "react";
import { range } from "lodash";
import * as classNames from "classnames";
import { Link } from "react-router-dom";
import { LocationDescriptor } from "history";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
const styles = require("./linkPagination.scss");

export interface LinkPaginationProps {
  type: string; // This is needed for React reiteration key.
  currentPageIndex: number;
  totalPage: number;
  getLinkDestination: (page: number) => string | LocationDescriptor;
  itemStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
}

class LinkPagination extends React.PureComponent<LinkPaginationProps, {}> {
  public render() {
    const pageArray = this.makePageArray();
    const pageNodes = pageArray.map((pageNumber, index) => {
      return (
        <Link
          to={this.props.getLinkDestination(pageNumber)}
          style={this.props.itemStyle}
          key={`${this.props.type}_${index}`}
          className={classNames({
            [`${styles.pageItem}`]: true,
            [`${styles.active}`]: index === this.props.currentPageIndex,
          })}
        >
          {pageNumber}
        </Link>
      );
    });

    const firstPageIcon =
      this.props.currentPageIndex !== 0 ? (
        <Link to={this.props.getLinkDestination(1)} className={styles.pageIconButton}>
          <Icon icon="LAST_PAGE" />
        </Link>
      ) : null;

    const prevIcon =
      this.props.currentPageIndex !== 0 ? (
        <Link to={this.props.getLinkDestination(this.props.currentPageIndex)} className={styles.pageIconButton}>
          <Icon icon="NEXT_PAGE" />
        </Link>
      ) : null;

    const nextIcon =
      this.props.currentPageIndex + 1 !== this.props.totalPage && this.props.totalPage !== 0 ? (
        <div className={styles.nextButtons}>
          <Link to={this.props.getLinkDestination(this.props.currentPageIndex + 2)} className={styles.pageIconButton}>
            <Icon icon="NEXT_PAGE" />
          </Link>
        </div>
      ) : null;

    return (
      <div style={this.props.wrapperStyle} className={styles.paginationWrapper}>
        <div className={styles.prevButtons}>
          {firstPageIcon}
          {prevIcon}
        </div>
        {pageNodes}
        {nextIcon}
      </div>
    );
  }

  private makePageArray(): number[] {
    const totalPageIndex = this.props.totalPage - 1;
    let startPageIndex: number;
    let endPageIndex: number;

    const isShowAllPage = this.props.totalPage <= 10;
    if (isShowAllPage) {
      startPageIndex = 0;
      endPageIndex = totalPageIndex;
    } else {
      const isExistNextFourPageAfterTotalPages = this.props.currentPageIndex + 4 >= totalPageIndex;
      if (this.props.currentPageIndex <= 6) {
        startPageIndex = 0;
        endPageIndex = 9;
      } else if (isExistNextFourPageAfterTotalPages) {
        startPageIndex = totalPageIndex - 9;
        endPageIndex = totalPageIndex;
      } else {
        startPageIndex = this.props.currentPageIndex - 5;
        endPageIndex = this.props.currentPageIndex + 4;
      }
    }

    return range(startPageIndex + 1, endPageIndex + 2);
  }
}

export default withStyles<typeof LinkPagination>(styles)(LinkPagination);
