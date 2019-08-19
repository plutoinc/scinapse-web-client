import * as React from 'react';
import { connect } from 'react-redux';
import * as classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
import CiteBox from '../../../containers/paperShowActionBar/components/citeBox';
import PdfDownloadButton from '../components/pdfDownloadButton';
import RequestFullTextBtn from '../../../containers/paperShowActionBar/components/fullTextRequestBtn';
import RequestFullTextDialog from '../../../containers/paperShowActionBar/components/fullTextDialog';
import { PDFButtonProps, TabItemProps, PaperShowRefCitedTabProps } from './types';
import { openRecommendationPapersGuideDialog } from '../../../actions/recommendation';
import { addPaperToRecommendation } from '../../../helpers/recommendationPoolManager';
const styles = require('./refCitedTab.scss');

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
  const { dispatch, paper, isLoading, canShowFullPDF, onClickDownloadPDF, afterDownloadPDF, currentUser } = props;
  const [isOpen, setIsOpen] = React.useState(false);

  if (canShowFullPDF) {
    return (
      <>
        <PdfDownloadButton
          actionArea="contentNavBar"
          paper={paper}
          currentUser={currentUser}
          isLoading={isLoading}
          onDownloadedPDF={onClickDownloadPDF!}
          handleSetScrollAfterDownload={afterDownloadPDF}
        />
      </>
    );
  }
  return (
    <>
      <RequestFullTextBtn
        actionArea="contentNavBar"
        isLoggedIn={currentUser.isLoggedIn}
        isLoading={isLoading}
        paperId={paper!.id}
        handleSetIsOpen={setIsOpen}
        btnStyle={{ flex: '1 0 auto', height: '36px', padding: '0 12px 0 8px' }}
        lastRequestedDate={props.lastRequestedDate}
      />
      <RequestFullTextDialog
        paperId={paper.id}
        isOpen={isOpen}
        onClose={async () => {
          setIsOpen(false);
          await addPaperToRecommendation(currentUser.isLoggedIn, paper!.id);
          dispatch(openRecommendationPapersGuideDialog(currentUser.isLoggedIn, 'requestFullTextBtn'));
        }}
      />
    </>
  );
};

const PDFButtonWithDialog = connect()(PDFButton);

const PaperShowRefCitedTab: React.FC<PaperShowRefCitedTabProps> = React.memo(props => {
  let fullTextNode;
  const actionBtnEl = React.useRef<HTMLDivElement | null>(null);

  if (props.canShowFullPDF) {
    fullTextNode = (
      <TabItem active={!!props.isOnFullText} onClick={props.onClickTabItem('fullText')} text="Full Text" />
    );
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
            onClick={props.onClickTabItem('ref')}
            text={`References (${props.paper.referenceCount})`}
          />
          <TabItem
            active={props.isOnCited}
            onClick={props.onClickTabItem('cited')}
            text={`Citations (${props.paper.citedCount})`}
          />
        </ul>
        <div className={styles.rightBtnBox}>
          <div className={styles.actionItem}>
            <CiteBox
              currentUser={props.currentUser}
              actionArea="contentNavBar"
              paper={props.paper}
              btnStyle={{ maxWidth: '74px', width: '100%', height: '36px' }}
            />
          </div>
          <div className={styles.actionItem} ref={actionBtnEl}>
            <PDFButtonWithDialog
              currentUser={props.currentUser}
              paper={props.paper}
              isLoading={props.isLoading}
              canShowFullPDF={props.canShowFullPDF}
              actionBtnEl={actionBtnEl.current}
              onClickDownloadPDF={props.onClickDownloadPDF!}
              afterDownloadPDF={props.afterDownloadPDF!}
              lastRequestedDate={props.lastRequestedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default withStyles<typeof PaperShowRefCitedTab>(styles)(PaperShowRefCitedTab);
