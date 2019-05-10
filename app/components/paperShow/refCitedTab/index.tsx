import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import CiteBox from "../../../containers/paperShowActionBar/components/citeBox";
import PdfDownloadButton from "../components/pdfDownloadButton";
import RequestFullTextBtn from "../../../containers/paperShowActionBar/components/fullTextRequestBtn";
import RequestFullTextDialog from "../../../containers/paperShowActionBar/components/fullTextDialog";
import { PDFButtonProps, TabItemProps, PaperShowRefCitedTabProps } from "./types";
const styles = require("./refCitedTab.scss");

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

const PDFButton: React.FunctionComponent<PDFButtonProps> = props => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (props.hasPDF) {
    return (
      <div className={styles.actionItem}>
        <PdfDownloadButton paper={props.paper} isLoadingOaCheck={props.isLoadingOaCheck} />
      </div>
    );
  }
  return (
    <>
      <div className={styles.actionItem}>
        <RequestFullTextBtn
          isLoadingOaCheck={props.isLoadingOaCheck}
          paperId={props.paper!.id}
          handleSetIsOpen={setIsOpen}
          btnStyle={{ flex: "1 0 auto", height: "36px", padding: "0 12px 0 8px" }}
        />
      </div>
      <RequestFullTextDialog
        paperId={props.paper.id}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
};

const PaperShowRefCitedTab: React.FunctionComponent<PaperShowRefCitedTabProps> = props => {
  let fullTextNode;
  if (props.hasFullText && props.handleClickFullTextTab) {
    fullTextNode = <TabItem active={!!props.isOnFullText} onClick={props.handleClickFullTextTab} text="Full Text" />;
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
          <TabItem
            active={props.isOnRef}
            onClick={props.handleClickRefTab}
            text={`References (${props.paper.referenceCount})`}
          />
          <TabItem
            active={props.isOnCited}
            onClick={props.handleClickCitedTab}
            text={`Citations (${props.paper.citedCount})`}
          />
        </ul>
        <div className={styles.rightBtnBox}>
          <div className={styles.actionItem}>
            <CiteBox paper={props.paper} btnStyle={{ maxWidth: "74px", width: "100%", height: "36px" }} />
          </div>
          <PDFButton paper={props.paper} isLoadingOaCheck={props.isLoadingOaCheck} hasPDF={props.hasFullText} />
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof PaperShowRefCitedTab>(styles)(PaperShowRefCitedTab);
