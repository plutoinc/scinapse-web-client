import * as React from 'react';
import { range } from 'lodash';
import * as classNames from 'classnames';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import { LocationDescriptor } from '../../../../node_modules/@types/history';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../locationListener';
const styles = require('./desktopPagination.scss');

interface CommonPaginationProps
  extends RouteComponentProps,
    Readonly<{
      type: string;
      currentPageIndex: number;
      totalPage: number;
      itemStyle?: React.CSSProperties;
      wrapperStyle?: React.CSSProperties;
      actionArea?: Scinapse.ActionTicket.ActionArea;
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

function trackActionToClickPagination(actionLabel: string, actionArea?: Scinapse.ActionTicket.ActionArea) {
  ActionTicketManager.trackTicket({
    pageType: getCurrentPageType(),
    actionType: 'fire',
    actionArea: actionArea || 'paperList',
    actionTag: 'clickPagination',
    actionLabel,
  });
}

export function makePageNumberArray(props: DesktopPaginationProps): number[] {
  const totalPage = props.totalPage;
  const currentPage = props.currentPageIndex + 1;

  let startPage: number;
  let endPage: number;

  if (currentPage - 5 <= 1) {
    startPage = 1;
    endPage = totalPage >= 10 ? 10 + 1 : totalPage + 1;
  } else if (totalPage > currentPage + 5) {
    startPage = currentPage - 5;
    endPage = currentPage + 5;
  } else {
    startPage = totalPage - 6;
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
      <Link
        onClick={() => {
          trackActionToClickPagination('firstPage');
        }}
        rel="nofollow"
        to={(props as LinkPaginationProps).getLinkDestination(1)}
        className={styles.pageIconButton}
        aria-label="Get First page icon"
      >
        <Icon icon="ARROW_RIGHT_DOUBLE" />
      </Link>
    );
  } else {
    return (
      <span
        onClick={() => {
          trackActionToClickPagination('firstPage');
          (props as EventPaginationProps).onItemClick(1);
        }}
        className={styles.pageIconButton}
      >
        <Icon icon="ARROW_RIGHT_DOUBLE" />
      </span>
    );
  }
}

function getNextIcon(props: DesktopPaginationProps) {
  if (props.currentPageIndex + 1 === props.totalPage || props.totalPage === 0) {
    return null;
  }

  if (isLinkPagination(props)) {
    if (props.type === 'paper_search_result') {
      return (
        <div className={styles.nextButtons}>
          <span
            onClick={async () => {
              trackActionToClickPagination('nextPage', props.actionArea);
              props.history.push(`${(props as LinkPaginationProps).getLinkDestination(props.currentPageIndex + 2)}`);
            }}
            className={styles.pageIconButton}
          >
            <Icon icon="ARROW_RIGHT" />
          </span>
        </div>
      );
    }

    return (
      <div className={styles.nextButtons}>
        <Link
          rel="nofollow"
          onClick={() => {
            trackActionToClickPagination('nextPage', props.actionArea);
          }}
          to={(props as LinkPaginationProps).getLinkDestination(props.currentPageIndex + 2)}
          className={styles.pageIconButton}
          aria-label="Next page Icon"
        >
          <Icon icon="ARROW_RIGHT" />
        </Link>
      </div>
    );
  } else {
    return (
      <div className={styles.nextButtons}>
        <span
          onClick={() => {
            trackActionToClickPagination('nextPage', props.actionArea);
            (props as EventPaginationProps).onItemClick(props.currentPageIndex + 2);
          }}
          className={styles.pageIconButton}
        >
          <Icon icon="ARROW_RIGHT" />
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
        rel="nofollow"
        onClick={() => {
          trackActionToClickPagination('prevPage', props.actionArea);
        }}
        to={(props as LinkPaginationProps).getLinkDestination(props.currentPageIndex)}
        className={styles.pageIconButton}
        aria-label="Go prev page icon"
      >
        <Icon icon="ARROW_RIGHT" />
      </Link>
    );
  } else {
    return (
      <span
        onClick={() => {
          trackActionToClickPagination('prevPage', props.actionArea);
          (props as EventPaginationProps).onItemClick(props.currentPageIndex);
        }}
        className={styles.pageIconButton}
      >
        <Icon icon="ARROW_RIGHT" />
      </span>
    );
  }
}

const getEventPageItem = (props: EventPaginationProps, pageNumber: number, currentPage: number) => {
  return (
    <span
      onClick={() => {
        props.onItemClick(pageNumber);
        trackActionToClickPagination(String(pageNumber), props.actionArea);
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
  if (props.type === 'paper_search_result') {
    return (
      <span
        onClick={async () => {
          trackActionToClickPagination(String(pageNumber), props.actionArea);
          props.history.push(`${props.getLinkDestination(pageNumber)}`);
        }}
        style={props.itemStyle}
        key={`${props.type}_${pageNumber}`}
        className={classNames({
          [`${styles.pageItem}`]: true,
          [`${styles.active}`]: currentPage === pageNumber,
        })}
      >
        {pageNumber}
      </span>
    );
  }

  return (
    <Link
      onClick={() => {
        trackActionToClickPagination(String(pageNumber), props.actionArea);
      }}
      rel="nofollow"
      to={props.getLinkDestination(pageNumber)}
      style={props.itemStyle}
      key={`${props.type}_${pageNumber}`}
      className={classNames({
        [`${styles.pageItem}`]: true,
        [`${styles.active}`]: currentPage === pageNumber,
      })}
      aria-label="Go target number of page icon"
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

export default withRouter(withStyles<typeof DesktopPagination>(styles)(DesktopPagination));
