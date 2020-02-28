import React, { memo } from 'react';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { pdfjs, Document, Page } from 'react-pdf';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@pluto_network/pluto-design-elements';
import ActionTicketManager from '../../helpers/actionTicketManager';
import Icon from '../../icons';
import { ActionCreators } from '../../actions/actionTypes';
import { AUTH_LEVEL, blockUnverifiedUser } from '../../helpers/checkAuthDialog';
import EnvChecker from '../../helpers/envChecker';
import { PDFViewerProps } from './types';
import { AppState } from '../../reducers';
import ProgressSpinner from './component/progressSpinner';
import BlurBlocker from './component/blurBlocker';
import { addPaperToRecommendPool } from '../recommendPool/actions';
import { PDFViewerState } from '../../reducers/pdfViewer';
import { getBestPdf } from '../../actions/pdfViewer';
const useStyles = require('isomorphic-style-loader/useStyles');
const styles = require('./pdfViewer.scss');

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DIRECT_PDF_PATH_PREFIX = 'https://asset-pdf.scinapse.io/';

function trackClickButton(actionTag: Scinapse.ActionTicket.ActionTagType, paperId: string) {
  ActionTicketManager.trackTicket({
    pageType: 'paperShow',
    actionType: 'fire',
    actionArea: 'pdfViewer',
    actionTag,
    actionLabel: String(paperId),
  });
}

function getDirectPDFPath(path: string) {
  return `${DIRECT_PDF_PATH_PREFIX + path}`;
}

const PDFViewer: React.FC<PDFViewerProps> = memo(
  props => {
    useStyles(styles);

    const { paper } = props;
    const dispatch = useDispatch();
    const PDFViewerState = useSelector<AppState, PDFViewerState>(state => state.PDFViewerState);
    const isLoggedIn = useSelector<AppState, boolean>(state => state.currentUser.isLoggedIn);
    const [pdfFile, setPdfFile] = React.useState<{ data: ArrayBuffer } | null>(null);
    const wrapperNode = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      let shouldUpdate = true;

      getBestPdf(paper)
        .then(bestPdf => {
          dispatch(ActionCreators.startToFetchPDF());

          if (!bestPdf.path) return dispatch(ActionCreators.finishToFetchPDF());

          // paper exists in Pluto server
          Axios.get(getDirectPDFPath(bestPdf.path), {
            responseType: 'arraybuffer',
          }).then(res => {
            if (shouldUpdate) {
              setPdfFile({ data: res.data });
              dispatch(ActionCreators.finishToFetchPDF());
            }
          });
        })
        .catch(_err => {
          dispatch(ActionCreators.failToFetchPDF());
        });
      return () => {
        shouldUpdate = false;
        dispatch(ActionCreators.cancelToFetchPDF());
      };
    }, [dispatch, paper]);

    if (PDFViewerState.isLoading) return <ProgressSpinner />; // loading state
    if (!pdfFile) return null; // empty state

    return (
      <div ref={wrapperNode} className={styles.contentWrapper}>
        <Document
          file={pdfFile}
          loading={
            <div className={styles.loadingContainerWrapper}>
              <div className={styles.loadingContainer}>
                <CircularProgress size={100} thickness={2} color="inherit" />
              </div>
            </div>
          }
          onLoadSuccess={(pdf: any) => {
            dispatch(ActionCreators.succeedToFetchPDF({ pageCount: pdf.numPages }));
            ActionTicketManager.trackTicket({
              pageType: 'paperShow',
              actionType: 'view',
              actionArea: 'pdfViewer',
              actionTag: 'viewPDF',
              actionLabel: String(paper.id),
            });
          }}
          onLoadError={err => {
            console.error(err);
            dispatch(ActionCreators.failToFetchPDF());
          }}
        >
          <div
            style={{
              height: !isLoggedIn ? '500px' : 'auto',
            }}
            className={styles.pageLayer}
          >
            <Page width={996} className={styles.page} pageNumber={1} />
          </div>
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
          {!isLoggedIn && <BlurBlocker paperId={paper.id} />}
          {isLoggedIn && !PDFViewerState.hasFailed && paper.bestPdf && (
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
                    window.open(paper.bestPdf!.url, '_blank');
                  }
                }}
              >
                <Icon icon="PDF_PAPER" />
                <span>Show All</span>
              </Button>
            </>
          )}
        </div>
      </div>
    );
  },
  (prev, next) => prev.paper.id === next.paper.id
);

export default PDFViewer;
