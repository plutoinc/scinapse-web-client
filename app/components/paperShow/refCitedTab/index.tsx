import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Paper } from "../../../model/paper";
import CiteBox from "../../../containers/paperShowActionBar/components/citeBox";
import PdfDownloadButton from "../components/pdfDownloadButton";
import FullTextBtn from "../../../containers/paperShowActionBar/components/fullTextBtn";
import FullTextDialog from "../../../containers/paperShowActionBar/components/fullTextDialog";
const styles = require("./refCitedTab.scss");

interface PaperShowRefCitedTabProps {
  paper: Paper;
  isLoadingOaCheck: boolean;
  isFetchingPdf: boolean;
  failedToLoadPDF: boolean;
  isFixed: boolean;
  isOnRef: boolean;
  isOnCited: boolean;
  hasBestPdf: boolean;
  showFullText?: boolean;
  isOnFullText?: boolean;

  handleClickRef: () => void;
  handleClickCited: () => void;
  handleClickFullText?: () => void;
}

const PaperShowRefCitedTab: React.SFC<PaperShowRefCitedTabProps> = props => {
  const [isOpen, setIsOpen] = React.useState(false);
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
      <div className={styles.paperContentBlockHeaderTabContentWrapper}>
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
          <div className={styles.actionItem}>
            <CiteBox paper={props.paper} btnStyle={{ maxWidth: "74px", width: "100%", height: "36px" }} />
          </div>
          {props.hasBestPdf && (props.isFetchingPdf || !props.failedToLoadPDF) ? (
            <div className={styles.actionItem}>
              <PdfDownloadButton
                paper={props.paper}
                isLoadingOaCheck={props.isLoadingOaCheck}
                isFetchingPDF={props.isFetchingPdf}
              />
            </div>
          ) : (
            <div className={styles.actionItem}>
              <FullTextBtn
                isLoadingOaCheck={props.isLoadingOaCheck}
                isFetchingPDF={props.isFetchingPdf}
                paperId={props.paper!.id}
                handleSetIsOpen={setIsOpen}
                btnStyle={{ flex: "1 0 auto", height: "36px", padding: "0 12px 0 8px" }}
              />
            </div>
          )}
          <FullTextDialog
            paperId={props.paper.id}
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof PaperShowRefCitedTab>(styles)(PaperShowRefCitedTab);
