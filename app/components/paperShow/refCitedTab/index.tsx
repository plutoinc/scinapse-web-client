import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import { trackEvent } from "../../../helpers/handleGA";
const styles = require("./refCitedTab.scss");

interface PaperShowRefCitedTabProps {
  referenceCount: number;
  citedCount: number;
  isFixed: boolean;
  isOnRef: boolean;
  isOnCited: boolean;
  showFullText?: boolean;

  handleClickRef: () => void;
  handleClickCited: () => void;
}

const PaperShowRefCitedTab: React.SFC<PaperShowRefCitedTabProps> = props => {
  return (
    <div
      className={classNames({
        [`${styles.paperContentBlockHeaderTabs}`]: !props.isFixed,
        [`${styles.paperContentBlockHeaderTabs} ${styles.stick}`]: props.isFixed,
      })}
    >
      <ul className={styles.headerTabList}>
        <li
          className={classNames({
            [styles.headerTabItem]: true,
            [styles.active]: props.isOnRef,
          })}
          onClick={props.handleClickRef}
        >
          Full text
        </li>
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
