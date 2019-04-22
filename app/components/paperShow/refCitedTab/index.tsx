import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Paper } from "../../../model/paper";
import CiteBox from "../../../containers/paperShowActionBar/components/citeBox";
import PdfDownloadButton from "../components/pdfDownloadButton";
const styles = require("./refCitedTab.scss");

interface PaperShowRefCitedTabProps {
  paper: Paper;
  isLoadPDF: boolean;
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
  const referenceCount = props.paper.referenceCount;
  const citedCount = props.paper.citedCount;
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
          {`References (${referenceCount})`}
        </li>
        <li
          className={classNames({
            [styles.headerTabItem]: true,
            [styles.active]: props.isOnCited,
          })}
          onClick={props.handleClickCited}
        >
          {`Cited By (${citedCount})`}
        </li>
      </ul>

      <div className={styles.rightBtnBox}>
        <CiteBox
          paper={props.paper}
          btnStyle={{ maxWidth: "74px", width: "100%", height: "36px", marginRight: "8px" }}
        />
        <PdfDownloadButton paper={props.paper} isLoadPDF={props.isLoadPDF} />
      </div>
    </div>
  );
};

export default withStyles<typeof PaperShowRefCitedTab>(styles)(PaperShowRefCitedTab);
