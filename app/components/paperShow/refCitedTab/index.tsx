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
  const {
    paper,
    isLoading,
    canShowFullPDF,
    isOpenBlockedPopper,
    actionBtnEl,
    onClickDownloadPDF,
    afterDownloadPDF,
    handleSetIsOpenBlockedPopper,
    handleCloseBlockedPopper,
    currentUser,
  } = props;
  const [isOpen, setIsOpen] = React.useState(false);

  const blockedPopper = (
    <BlockedPopper
      handleOnClickAwayFunc={handleCloseBlockedPopper}
      anchorEl={actionBtnEl}
      isOpen={isOpenBlockedPopper}
      buttonClickAction={canShowFullPDF ? "downloadPdf" : "clickRequestFullTextBtn"}
    />
  );

  if (canShowFullPDF) {
    return (
      <>
        <PdfDownloadButton
          paper={paper}
          currentUser={currentUser}
          isLoading={isLoading}
          isOpenBlockedPopper={isOpenBlockedPopper}
          onDownloadedPDF={onClickDownloadPDF!}
          handleSetIsOpenBlockedPopper={handleSetIsOpenBlockedPopper}
          handleSetScrollAfterDownload={afterDownloadPDF}
        />
        {blockedPopper}
      </>
    );
  }
  return (
    <>
      <RequestFullTextBtn
        currentUser={currentUser}
        isLoading={isLoading}
        paperId={paper!.id}
        isOpenBlockedPopper={isOpenBlockedPopper}
        handleSetIsOpen={setIsOpen}
        handleSetIsOpenBlockedPopper={handleSetIsOpenBlockedPopper}
        btnStyle={{ flex: "1 0 auto", height: "36px", padding: "0 12px 0 8px" }}
      />
      {blockedPopper}
      <RequestFullTextDialog
        paperId={paper.id}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
};

const PaperShowRefCitedTab: React.FC<PaperShowRefCitedTabProps> = React.memo(props => {
  let fullTextNode;
  const actionBtnEl = React.useRef<HTMLDivElement | null>(null);
  const [isOpenBlockedPopper, setIsOpenBlockedPopper] = React.useState(false);

  const closeBlockedPopper = () => {
    if (isOpenBlockedPopper) {
      setIsOpenBlockedPopper(false);
    }
  };

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
          <ClickAwayListener onClickAway={closeBlockedPopper}>
            <div className={styles.actionItem} ref={actionBtnEl}>
              <PDFButton
                currentUser={props.currentUser}
                paper={props.paper}
                isLoading={props.isLoading}
                canShowFullPDF={props.canShowFullPDF}
                isOpenBlockedPopper={isOpenBlockedPopper}
                actionBtnEl={actionBtnEl.current}
                handleSetIsOpenBlockedPopper={setIsOpenBlockedPopper}
                handleCloseBlockedPopper={closeBlockedPopper}
                onClickDownloadPDF={props.onClickDownloadPDF!}
                afterDownloadPDF={props.onClickFullTextTab!}
              />
            </div>
          </ClickAwayListener>
        </div>
      </div>
    </div>
  );
});

export default withStyles<typeof PaperShowRefCitedTab>(styles)(PaperShowRefCitedTab);
