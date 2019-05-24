import * as React from "react";
import * as classNames from "classnames";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { withStyles } from "../../../helpers/withStylesHelper";
import CiteBox from "../../../containers/paperShowActionBar/components/citeBox";
import PdfDownloadButton from "../components/pdfDownloadButton";
import RequestFullTextBtn from "../../../containers/paperShowActionBar/components/fullTextRequestBtn";
import RequestFullTextDialog from "../../../containers/paperShowActionBar/components/fullTextDialog";
import { PDFButtonProps, TabItemProps, PaperShowRefCitedTabProps } from "./types";
import BlockedPopper from "../../preNoted/blockedPopper";
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
  const [isOpenBlockedPopper, setIsOpenBlockedPopper] = React.useState(false);
  const actionBtnEl = React.useRef<HTMLDivElement | null>(null);

  if (props.canShowFullPDF) {
    return (
      <ClickAwayListener onClickAway={() => setIsOpenBlockedPopper(false)}>
        <div className={styles.actionItem} ref={actionBtnEl}>
          <PdfDownloadButton
            paper={props.paper}
            isLoading={props.isLoading}
            isOpenBlockedPopper={isOpenBlockedPopper}
            onDownloadedPDF={props.onClickDownloadPDF!}
            handleSetIsOpenBlockedPopper={setIsOpenBlockedPopper}
            handleSetScrollAfterDownload={props.afterDownloadPDF}
          />
          <BlockedPopper
            handleOnClickAwayFunc={() => setIsOpenBlockedPopper(false)}
            anchorEl={actionBtnEl.current}
            isOpen={isOpenBlockedPopper}
            buttonClickAction={"downloadPdf"}
          />
        </div>
      </ClickAwayListener>
    );
  }
  return (
    <ClickAwayListener onClickAway={() => setIsOpenBlockedPopper(false)}>
      <div className={styles.actionItem} ref={actionBtnEl}>
        <RequestFullTextBtn
          isLoading={props.isLoading}
          paperId={props.paper!.id}
          isOpenBlockedPopper={isOpenBlockedPopper}
          handleSetIsOpen={setIsOpen}
          handleSetIsOpenBlockedPopper={setIsOpenBlockedPopper}
          btnStyle={{ flex: "1 0 auto", height: "36px", padding: "0 12px 0 8px" }}
        />
        <BlockedPopper
          handleOnClickAwayFunc={() => setIsOpenBlockedPopper(false)}
          anchorEl={actionBtnEl.current}
          isOpen={isOpenBlockedPopper}
          buttonClickAction={"clickRequestFullTextBtn"}
        />
        <RequestFullTextDialog
          paperId={props.paper.id}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      </div>
    </ClickAwayListener>
  );
};

const PaperShowRefCitedTab: React.FC<PaperShowRefCitedTabProps> = React.memo(props => {
  let fullTextNode;
  if (props.canShowFullPDF && props.onClickFullTextTab) {
    fullTextNode = <TabItem active={!!props.isOnFullText} onClick={props.onClickFullTextTab} text="Full Text" />;
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
          <PDFButton
            paper={props.paper}
            isLoading={props.isLoading}
            canShowFullPDF={props.canShowFullPDF}
            onClickDownloadPDF={props.onClickDownloadPDF!}
            afterDownloadPDF={props.onClickFullTextTab!}
          />
        </div>
      </div>
    </div>
  );
});

export default withStyles<typeof PaperShowRefCitedTab>(styles)(PaperShowRefCitedTab);
