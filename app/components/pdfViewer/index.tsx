import * as React from 'react';
import Axios, { CancelTokenSource } from 'axios';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../helpers/withStylesHelper';
import PaperAPI from '../../api/paper';
import ScinapseButton from '../common/scinapseButton';
import ActionTicketManager from '../../helpers/actionTicketManager';
import Icon from '../../icons';
import { PaperPdf, Paper } from '../../model/paper';
import { ActionCreators } from '../../actions/actionTypes';
import { AUTH_LEVEL, blockUnverifiedUser } from '../../helpers/checkAuthDialog';
import { PaperSource } from '../../model/paperSource';
import { EXTENSION_APP_ID } from '../../constants/scinapse-extension';
import EnvChecker from '../../helpers/envChecker';
import RelatedPapers from '../relatedPapers';
import AfterDownloadContents from './component/afterDownloadContents';
import { PDFViewerProps } from './types';
import { AppState } from '../../reducers';
import { makeGetMemoizedPapers } from '../../selectors/papersSelector';
import { getMemoizedCurrentUser } from '../../selectors/getCurrentUser';
import { getMemoizedPDFViewerState } from '../../selectors/getPDFViewer';
import ProgressSpinner from './component/progressSpinner';
import BlurBlocker from './component/blurBlocker';
import { addPaperToRecommendation, openRecommendationPapersGuideDialog } from '../../actions/recommendation';
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

function fetchPDFFromExtension(sources: PaperSource[]): Promise<{ data: Blob }> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && typeof chrome !== 'undefined') {
      chrome.runtime.sendMessage(EXTENSION_APP_ID, { message: 'CHECK_EXTENSION_EXIST' }, reply => {
        if (!reply || !reply.success) {
          return reject();
        }
      });

      const channel = new MessageChannel();
      window.postMessage(
        {
          type: 'GET_PDF',
          sources,
        },
        '*',
        [channel.port2]
      );

      channel.port1.onmessage = e => {
        if (e.data.success) {
          console.log('SUCCESS TO GET PDF from EXTENSION');
          resolve(e.data);
        } else {
          reject();
        }
      };
    } else {
      reject();
    }
  });
}

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

const PDFViewer: React.FunctionComponent<PDFViewerProps> = props => {
  const {
    dispatch,
    paper,
    PDFViewerState,
    relatedPaperList,
    isLoadingRelatedPaperList,
    shouldShowRelatedPapers,
    afterDownloadPDF,
    currentUser,
  } = props;
  const wrapperNode = React.useRef<HTMLDivElement | null>(null);
  const viewMorePDFBtnEl = React.useRef<HTMLDivElement | null>(null);
  const actionTag = PDFViewerState.isExpanded ? 'viewLessPDF' : 'viewMorePDF';

  React.useEffect(
    () => {
      if (paper.urls.length > 0) {
        const cancelToken = Axios.CancelToken.source();
        dispatch(ActionCreators.startToFetchPDF());
        fetchPDFFromExtension(paper.urls)
          .then(res => {
            dispatch(ActionCreators.setPDFBlob({ blob: res.data }));
          })
          .catch(err => {
            if (!Axios.isCancel(err)) {
              return fetchPDFFromAPI(paper, cancelToken, dispatch);
            } else {
              throw err;
            }
          })
          .then(res => {
            if (res && res.data) {
              dispatch(ActionCreators.setPDFBlob({ blob: res.data }));
            } else {
              throw new Error();
            }
          })
          .catch(err => {
            if (!Axios.isCancel(err)) {
              dispatch(ActionCreators.failToFetchPDF());
            }
          });

        return () => {
          cancelToken.cancel();
        };
      }
    },
    [paper.id]
  );

  if (PDFViewerState.isLoading) {
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

  if (!!PDFViewerState.pdfBlob) {
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
    const componentToShowReadAllArea = shouldShowBlurBlocker ? <BlurBlocker /> : ReadAllPDFButton;

    return (
      <div ref={wrapperNode} className={styles.contentWrapper}>
        <Document
          file={PDFViewerState.pdfBlob}
          error={null}
          loading={
            <div className={styles.loadingContainerWrapper}>
              <div className={styles.loadingContainer}>
                <CircularProgress size={100} thickness={2} color="inherit" />
              </div>
            </div>
          }
          onLoadSuccess={(pdf: any) => {
            dispatch(ActionCreators.succeedToFetchPDF({ pdf }));
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
            pdfBlob={PDFViewerState.parsedPDFObject}
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

                          addPaperToRecommendation(currentUser.isLoggedIn, paper.id);
                          dispatch(openRecommendationPapersGuideDialog(currentUser.isLoggedIn, 'downloadPdfButton'));

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
                    <RelatedPapers shouldShowRelatedPapers={shouldShowRelatedPapers} />
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

function mapStateToProps(state: AppState) {
  const getRelatedPapers = makeGetMemoizedPapers(() => state.relatedPapersState.paperIds);

  return {
    currentUser: getMemoizedCurrentUser(state),
    PDFViewerState: getMemoizedPDFViewerState(state),
    relatedPaperList: getRelatedPapers(state),
    isLoadingRelatedPaperList: state.relatedPapersState.isLoading,
  };
}

export default connect(mapStateToProps)(withStyles<typeof PDFViewer>(styles)(PDFViewer));
