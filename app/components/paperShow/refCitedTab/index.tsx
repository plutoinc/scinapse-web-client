import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Paper } from "../../../model/paper";
import CiteBox from "../../../containers/paperShowActionBar/components/citeBox";
import PdfDownloadButton from "../components/pdfDownloadButton";
import FullTextBtn from "../../../containers/paperShowActionBar/components/fullTextRequestBtn";
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

interface TabItemProps {
  active: boolean;
  text: string;
  onClick: () => void;
}
const TabItem: React.FunctionComponent<TabItemProps> = props => {
  return (
    <li
      className={classNames({
        [styles.headerTabItem]: true,
        [styles.active]: props.active,
      })}
      onClick={props.onClick}
    >
      {props.text}
    </li>
  );
};

const PaperShowRefCitedTab: React.FunctionComponent<PaperShowRefCitedTabProps> = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const referenceCount = props.paper.referenceCount;
  const citedCount = props.paper.citedCount;
  let fullTextNode;

  if (props.showFullText && props.handleClickFullText) {
    fullTextNode = <TabItem active={!!props.isOnFullText} onClick={props.handleClickFullText} text="Full Text" />;
  }

  return (
    <div
      className={classNames({
        [styles.paperContentBlockHeaderTabs]: !props.isFixed,
        [`${styles.paperContentBlockHeaderTabs} ${styles.stick} mui-fixed`]: props.isFixed,
      })}
    >
      <div className={styles.paperContentBlockHeaderTabContentWrapper}>
        <ul className={styles.headerTabList}>
          {fullTextNode}
          <TabItem active={props.isOnRef} onClick={props.handleClickRef} text={`References (${referenceCount})`} />
          <TabItem active={props.isOnCited} onClick={props.handleClickCited} text={`Citations (${citedCount})`} />
        </ul>

        <div className={styles.rightBtnBox}>
          <div className={styles.actionItem}>
            <CiteBox paper={props.paper} btnStyle={{ maxWidth: "74px", width: "100%", height: "36px" }} />
          </div>
          {props.hasBestPdf && (props.isFetchingPdf || !props.failedToLoadPDF) ? (
            <div className={styles.actionItem}>
              <PdfDownloadButton paper={props.paper} isLoadingOaCheck={props.isLoadingOaCheck} />
            </div>
          ) : (
            <div className={styles.actionItem}>
              <FullTextBtn
                isLoadingOaCheck={props.isLoadingOaCheck}
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
