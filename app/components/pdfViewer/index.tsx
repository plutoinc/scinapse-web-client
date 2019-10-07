import * as React from 'react';
import Axios, { CancelTokenSource } from 'axios';
import { Dispatch } from 'redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../helpers/withStylesHelper';
import PaperAPI from '../../api/paper';
import ScinapseButton from '../common/scinapseButton';
import ActionTicketManager from '../../helpers/actionTicketManager';
import Icon from '../../icons';
import { PaperPdf, Paper, paperSchema } from '../../model/paper';
import { ActionCreators } from '../../actions/actionTypes';
import { AUTH_LEVEL, blockUnverifiedUser } from '../../helpers/checkAuthDialog';
import EnvChecker from '../../helpers/envChecker';
import RelatedPapers from '../relatedPapers';
import AfterDownloadContents from './component/afterDownloadContents';
import { PDFViewerProps } from './types';
import { AppState } from '../../reducers';
import ProgressSpinner from './component/progressSpinner';
import BlurBlocker from './component/blurBlocker';
import { addPaperToRecommendPoolAndOpenDialog } from '../recommendPool/recommendPoolActions';
import { useDispatch, useSelector } from 'react-redux';
import { PDFViewerState } from '../../reducers/pdfViewer';
import { CurrentUser } from '../../model/currentUser';
import { createSelector } from 'redux-starter-kit';
import { denormalize } from 'normalizr';
const { Document, Page, pdfjs } = require('react-pdf');
const styles = require('./pdfViewer.scss');

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function trackClickButton(actionTag: Scinapse.ActionTicket.ActionTagType, paperId: number) {
  ActionTicketManager.trackTicket({
    pageType: 'paperShow',
    actionType: 'fire',
    actionArea: 'pdfViewer',
    actionTag,

    actionLabel: String(paperId),
  });
}

const baseBtnStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '150px',
  height: '40px',
};

const readAllBtnStyle: React.CSSProperties = {
  ...baseBtnStyle,
  position: 'relative',
  borderRadius: '27.5px',
  border: '1px solid #bbc2d0',
  fontSize: '16px',
  fontWeight: 500,
  letterSpacing: '1px',
  color: '#34495e',
};

const downloadPdfBtnStyle: React.CSSProperties = {
  ...baseBtnStyle,
  color: 'white',
  backgroundColor: '#3e7fff',
  marginLeft: '16px',
};

async function fetchPDFFromAPI(paper: Paper, cancelTokenSource: CancelTokenSource, dispatch: Dispatch<any>) {
  let pdf: PaperPdf | undefined = paper.bestPdf;
  const cancelToken = cancelTokenSource.token;

  if (!pdf) {
    pdf = await PaperAPI.getBestPdfOfPaper({ paperId: paper.id, cancelToken });
    if (pdf) {
      dispatch(ActionCreators.getBestPDFOfPaper({ paperId: paper.id, bestPDF: pdf }));
    }
  }

  if (pdf && pdf.hasBest) {
    const blob = await PaperAPI.getPDFBlob(pdf.url, cancelToken);
    return blob;
  }
  return null;
}

interface OnClickViewMorePdfBtnParams {
  paperId: number;
  dispatch: Dispatch<any>;
}
async function onClickViewMorePdfBtn(params: OnClickViewMorePdfBtnParams) {
  const { paperId, dispatch } = params;
  trackClickButton('viewMorePDF', paperId);

  dispatch(
    addPaperToRecommendPoolAndOpenDialog({
      pageType: 'paperShow',
      actionArea: 'viewMorePDF',
      recAction: { paperId, action: 'viewMorePDF' },
    })
  );

  const isBlocked = await blockUnverifiedUser({
    authLevel: AUTH_LEVEL.VERIFIED,
    actionArea: 'pdfViewer',
    actionLabel: 'viewMorePDF',
    userActionType: 'viewMorePDF',
  });

  if (isBlocked) {
    return;
  }

  dispatch(ActionCreators.clickPDFViewMoreBtn());
}

const PDFContent: React.FC<{
  pdfBlob: Blob | null;
  isExpanded: boolean;
  pageCountToShow: number;
  shouldShowBlurBlocker: boolean;
}> = React.memo(props => {
  if (!props.pdfBlob) return null;

  let pageContent;
  if (props.isExpanded) {
    pageContent = Array.from(new Array(props.pageCountToShow), (_el, i) => (
      <div key={i} className={styles.pageLayer}>
        <Page pdf={props.pdfBlob} width={996} margin={'0 auto'} key={i} pageNumber={i + 1} />
      </div>
    ));
  } else {
    pageContent = (
      <div
        style={{
          height: props.shouldShowBlurBlocker ? '500px' : 'auto',
        }}
        className={styles.pageLayer}
      >
        <Page pdf={props.pdfBlob} width={996} margin={'0 auto'} pageNumber={1} />
      </div>
    );
  }

  return <>{pageContent}</>;
});

const selectRelatedPapers = createSelector(
  [(state: AppState) => state.relatedPapersState.paperIds, (state: AppState) => state.entities.papers],
  (paperIds, paperEntities) => {
    return denormalize(paperIds, [paperSchema], { papers: paperEntities });
  }
);

const PDFViewer: React.FC<PDFViewerProps> = props => {
  const { paper, afterDownloadPDF } = props;
  const dispatch = useDispatch();
  const PDFViewerState = useSelector<AppState, PDFViewerState>(state => state.PDFViewerState);
  const currentUser = useSelector<AppState, CurrentUser>(state => state.currentUser);
  const isLoadingRelatedPaperList = useSelector<AppState, boolean>(state => state.relatedPapersState.isLoading);
  const relatedPaperList = useSelector(selectRelatedPapers);

  const [pdfBlob, setPdfBlob] = React.useState<Blob | null>(null);
  const [parsedPdfObject, setParsedPdfObject] = React.useState<any>(null);
  const wrapperNode = React.useRef<HTMLDivElement | null>(null);
  const viewMorePDFBtnEl = React.useRef<HTMLDivElement | null>(null);
  const cancelTokenSource = React.useRef<CancelTokenSource>(Axios.CancelToken.source());
  const actionTag = PDFViewerState.isExpanded ? 'viewLessPDF' : 'viewMorePDF';

  React.useEffect(
    () => {
      if (pdfBlob || PDFViewerState.isLoading) return;

      dispatch(ActionCreators.startToFetchPDF());
      fetchPDFFromAPI(paper, cancelTokenSource.current, dispatch)
        .then(res => {
          if (res && res.data) {
            setPdfBlob(res.data);
            return dispatch(ActionCreators.finishToFetchPDF());
          } else {
            throw new Error('No PDF');
          }
        })
        .catch(err => {
          if (!Axios.isCancel(err)) {
            dispatch(ActionCreators.failToFetchPDF());
          } else {
            dispatch(ActionCreators.cancelToFetchPDF());
          }
        });

      return () => {
        cancelTokenSource.current.cancel();
        cancelTokenSource.current = Axios.CancelToken.source();
      };
    },
    [dispatch, paper.id]
  );

  if (PDFViewerState.isLoading && !pdfBlob) {
    return <ProgressSpinner />;
  }

  if (PDFViewerState.hasClickedDownloadBtn) {
    return (
      <div ref={wrapperNode} className={styles.contentWrapper}>
        <AfterDownloadContents
          onClickReloadBtn={() => {
            dispatch(ActionCreators.clickPDFReloadBtn());
          }}
          relatedPaperList={relatedPaperList}
          isLoggedIn={currentUser.isLoggedIn}
          isRelatedPaperLoading={isLoadingRelatedPaperList}
          title={paper.title}
        />
      </div>
    );
  }

  if (!!pdfBlob) {
    const ReadAllPDFButton = (
      <div ref={viewMorePDFBtnEl}>
        <ScinapseButton
          gaCategory="PDF viewer"
          gaAction={actionTag}
          style={readAllBtnStyle}
          content={
            <span>
              READ ALL <Icon icon="ARROW_POINT_TO_UP" className={styles.arrowIcon} />
            </span>
          }
          isLoading={PDFViewerState.isLoading}
          disabled={PDFViewerState.hasFailed}
          onClick={() => {
            onClickViewMorePdfBtn({
              paperId: props.paper.id,
              dispatch,
            });
          }}
        />
      </div>
    );

    const shouldShowBlurBlocker = !currentUser.isLoggedIn && !currentUser.isLoggingIn;
    const componentToShowReadAllArea = shouldShowBlurBlocker ? <BlurBlocker paperId={paper.id} /> : ReadAllPDFButton;

    return (
      <div ref={wrapperNode} className={styles.contentWrapper}>
        <Document
          file={pdfBlob}
          error={null}
          loading={
            <div className={styles.loadingContainerWrapper}>
              <div className={styles.loadingContainer}>
                <CircularProgress size={100} thickness={2} color="inherit" />
              </div>
            </div>
          }
          onLoadSuccess={(pdf: any) => {
            setParsedPdfObject(pdf);
            dispatch(ActionCreators.succeedToFetchPDF({ pageCount: pdf.numPages }));
            ActionTicketManager.trackTicket({
              pageType: 'paperShow',
              actionType: 'view',
              actionArea: 'pdfViewer',
              actionTag: 'viewPDF',
              actionLabel: String(paper.id),
            });
          }}
          onLoadError={() => {
            dispatch(ActionCreators.failToFetchPDF());
          }}
        >
          <PDFContent
            shouldShowBlurBlocker={shouldShowBlurBlocker}
            pdfBlob={parsedPdfObject}
            isExpanded={PDFViewerState.isExpanded}
            pageCountToShow={PDFViewerState.pageCountToShow}
          />
        </Document>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '40px',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {!PDFViewerState.hasFailed &&
            paper.bestPdf && (
              <>
                {PDFViewerState.isExpanded ? (
                  <>
                    <ScinapseButton
                      gaCategory="PDF viewer"
                      gaAction="download PDF"
                      style={downloadPdfBtnStyle}
                      target="_blank"
                      href={paper.bestPdf.url}
                      rel="nofollow"
                      content={
                        <span className={styles.downloadBtnWrapper}>
                          <Icon icon="DOWNLOAD" className={styles.downloadIcon} /> Download PDF
                        </span>
                      }
                      onClick={async e => {
                        if (!EnvChecker.isOnServer()) {
                          e.preventDefault();

                          dispatch(
                            addPaperToRecommendPoolAndOpenDialog({
                              pageType: 'paperShow',
                              actionArea: 'downloadPdf',
                              recAction: { paperId: paper.id, action: 'viewMorePDF' },
                            })
                          );

                          const isBlocked = await blockUnverifiedUser({
                            authLevel: AUTH_LEVEL.VERIFIED,
                            actionArea: 'pdfViewer',
                            actionLabel: 'downloadPdf',
                            userActionType: 'downloadPdf',
                          });

                          if (isBlocked) {
                            return;
                          }

                          dispatch(ActionCreators.clickPDFDownloadBtn());
                          trackClickButton('downloadPdf', paper.id);
                          window.open(paper.bestPdf.url, '_blank');
                          afterDownloadPDF();
                        }
                      }}
                      isExternalLink
                      downloadAttr
                    />
                    <RelatedPapers shouldShowRelatedPapers={!paper.bestPdf || !paper.bestPdf.hasBest} />
                  </>
                ) : (
                  componentToShowReadAllArea
                )}
              </>
            )}
        </div>
      </div>
    );
  }
  return null;
};

export default withStyles<typeof PDFViewer>(styles)(PDFViewer);
