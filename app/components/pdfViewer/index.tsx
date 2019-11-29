import * as React from 'react';
import Axios, { CancelTokenSource } from 'axios';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import { denormalize } from 'normalizr';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../helpers/withStylesHelper';
import ActionTicketManager from '../../helpers/actionTicketManager';
import Icon from '../../icons';
import { paperSchema } from '../../model/paper';
import { ActionCreators } from '../../actions/actionTypes';
import { AUTH_LEVEL, blockUnverifiedUser } from '../../helpers/checkAuthDialog';
import EnvChecker from '../../helpers/envChecker';
import RelatedPapers from '../relatedPapers';
import AfterDownloadContents from './component/afterDownloadContents';
import { PDFViewerProps } from './types';
import { AppState } from '../../reducers';
import ProgressSpinner from './component/progressSpinner';
import BlurBlocker from './component/blurBlocker';
import { addPaperToRecommendPool } from '../recommendPool/actions';
import { PDFViewerState } from '../../reducers/pdfViewer';
import { CurrentUser } from '../../model/currentUser';
import { getBestPdfOfPaper, getPDFPathOrBlob } from '../../actions/pdfViewer';
import { Button } from '@pluto_network/pluto-design-elements';
const { Document, Page, pdfjs } = require('react-pdf');
const styles = require('./pdfViewer.scss');

const DIRECT_PDF_PATH_PREFIX = 'https://asset-pdf.scinapse.io/';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function trackClickButton(actionTag: Scinapse.ActionTicket.ActionTagType, paperId: string) {
  ActionTicketManager.trackTicket({
    pageType: 'paperShow',
    actionType: 'fire',
    actionArea: 'pdfViewer',
    actionTag,

    actionLabel: String(paperId),
  });
}

interface OnClickViewMorePdfBtnParams {
  paperId: string;
  dispatch: Dispatch<any>;
}

function getDirectPDFPath(path: string) {
  return `${DIRECT_PDF_PATH_PREFIX + path}`;
}

async function onClickViewMorePdfBtn(params: OnClickViewMorePdfBtnParams) {
  const { paperId, dispatch } = params;
  trackClickButton('viewMorePDF', paperId);

  dispatch(addPaperToRecommendPool({ paperId: paperId, action: 'viewMorePDF' }));

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
  const [directPdfPath, setDirectPdfPath] = React.useState<string | null>(null);

  const [parsedPdfObject, setParsedPdfObject] = React.useState<any>(null);
  const wrapperNode = React.useRef<HTMLDivElement | null>(null);
  const viewMorePDFBtnEl = React.useRef<HTMLDivElement | null>(null);
  const cancelTokenSource = React.useRef<CancelTokenSource>(Axios.CancelToken.source());
  const cancelToken = cancelTokenSource.current.token;

  React.useEffect(
    () => {
      dispatch(getBestPdfOfPaper(paper, cancelToken));

      if (!paper.bestPdf || pdfBlob || PDFViewerState.isLoading) return;

      if (paper.bestPdf.path) return setDirectPdfPath(getDirectPDFPath(paper.bestPdf.path));

      dispatch(ActionCreators.startToFetchPDF());

      getPDFPathOrBlob(paper.bestPdf, cancelToken)
        .then(res => {
          if (!res) throw new Error('No PDF');

          if (typeof res === 'object') {
            const blob = res.data;
            setPdfBlob(blob);
          } else {
            setDirectPdfPath(getDirectPDFPath(res));
          }

          return dispatch(ActionCreators.finishToFetchPDF());
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

  if (PDFViewerState.isLoading && (!pdfBlob || !directPdfPath)) {
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

  if (!!pdfBlob || !!directPdfPath) {
    const ReadAllPDFButton = (
      <div ref={viewMorePDFBtnEl}>
        <Button
          elementType="button"
          variant="outlined"
          color="black"
          isLoading={PDFViewerState.isLoading}
          disabled={PDFViewerState.hasFailed}
          onClick={() => {
            onClickViewMorePdfBtn({
              paperId: props.paper.id,
              dispatch,
            });
          }}
          style={{ borderRadius: '27.5px' }}
        >
          <span>READ ALL</span>
          <Icon icon="ARROW_DOWN" />
        </Button>
      </div>
    );

    const shouldShowBlurBlocker = !currentUser.isLoggedIn && !currentUser.isLoggingIn;
    const componentToShowReadAllArea = shouldShowBlurBlocker ? <BlurBlocker paperId={paper.id} /> : ReadAllPDFButton;

    return (
      <div ref={wrapperNode} className={styles.contentWrapper}>
        <Document
          file={!!directPdfPath ? directPdfPath : pdfBlob}
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
                    <Button
                      elementType="anchor"
                      target="_blank"
                      href={paper.bestPdf.url}
                      rel="nofollow"
                      onClick={async e => {
                        if (!EnvChecker.isOnServer()) {
                          e.preventDefault();

                          dispatch(addPaperToRecommendPool({ paperId: paper.id, action: 'viewMorePDF' }));

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
                    >
                      <Icon icon="DOWNLOAD" />
                      <span>Download PDF</span>
                    </Button>
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
