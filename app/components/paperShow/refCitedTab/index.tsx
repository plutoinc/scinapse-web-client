import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import { trackEvent } from "../../../helpers/handleGA";
const styles = require("./refCitedTab.scss");

interface PaperShowRefCitedTabProps {
  referenceCount: number;
  citedCount: number;
  width: number;
  isFixed: boolean;
  isOnRef: boolean;
  isOnCited: boolean;
  showFullText?: boolean;
  isOnFullText?: boolean;

  handleClickRef: () => void;
  handleClickCited: () => void;
  handleClickFullText?: () => void;
}

const PaperShowRefCitedTab: React.SFC<PaperShowRefCitedTabProps> = props => {
  let fullTextNode;

  if (props.showFullText) {
    fullTextNode = (
      <li
        className={classNames({
          [styles.headerTabItem]: true,
          [styles.active]: props.isOnFullText,
        })}
        onClick={props.handleClickFullText}
      >
        Full text
      </li>
    );
  }

  return (
    <div
      className={classNames({
        [styles.paperContentBlockHeaderTabs]: !props.isFixed,
        [`${styles.paperContentBlockHeaderTabs} ${styles.stick}`]: props.isFixed,
      })}
      style={{ width: props.width }}
    >
      <ul className={styles.headerTabList}>
        {fullTextNode}
        <li
          className={classNames({
            [styles.headerTabItem]: true,
            [styles.active]: props.isOnRef,
          })}
          onClick={props.handleClickRef}
        >
          {`References (${props.referenceCount})`}
        </li>
        <li
          className={classNames({
            [styles.headerTabItem]: true,
            [styles.active]: props.isOnCited,
          })}
          onClick={props.handleClickCited}
        >
          {`Cited By (${props.citedCount})`}
        </li>
      </ul>
      <div className={styles.scrollTop}>
        <button
          className={styles.scrollButton}
          onClick={() => {
            window.scrollTo(0, 0);
            trackEvent({
              category: "New Paper Show",
              action: "Click Top Tab in Paper Show refBar",
              label: "Click Top Tab",
            });
          }}
        >
          ↑ Top
        </button>
      </div>
    </div>
  );
};

export default withStyles<typeof PaperShowRefCitedTab>(styles)(PaperShowRefCitedTab);
