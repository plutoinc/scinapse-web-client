import * as React from "react";
import Axios from "axios";
import { Dispatch } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import { withStyles } from "../../helpers/withStylesHelper";
import ScinapseButton from "../common/scinapseButton";
import ActionTicketManager from "../../helpers/actionTicketManager";
import Icon from "../../icons";
import { PaperPdf } from "../../model/paper";
import { ActionCreators } from "../../actions/actionTypes";
import { AUTH_LEVEL, blockUnverifiedUser } from "../../helpers/checkAuthDialog";
import getAPIHost from "../../api/getHost";
import { PaperSource } from "../../model/paperSource";
import { EXTENSION_APP_ID } from "../../constants/scinapse-extension";
import EnvChecker from "../../helpers/envChecker";
const { Document, Page, pdfjs } = require("react-pdf");
const styles = require("./pdfViewer.scss");

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFViewerProps {
  dispatch: Dispatch<any>;
  paperId: number;
  shouldShow: boolean;
  filename: string;
  sources: PaperSource[];
  bestPdf?: PaperPdf;
  handleGetBestPdf: () => Promise<PaperPdf> | undefined;
  onLoadSuccess: () => void;
  onFailed: () => void;
}

function useIntervalProgress(callback: () => void, delay: number | null) {
  const savedCallback = React.useRef(() => {});

  React.useEffect(
    () => {
      savedCallback.current = callback;
    },
    [callback]
  );

  React.useEffect(
    () => {
      function tick() {
        savedCallback.current();
      }

      if (delay !== null) {
        const timer = setInterval(tick, delay);
        return () => clearInterval(timer);
      }
    },
    [delay]
  );
}

function trackClickButton(actionTag: Scinapse.ActionTicket.ActionTagType, paperId: number) {
  ActionTicketManager.trackTicket({
    pageType: "paperShow",
    actionType: "fire",
    actionArea: "pdfViewer",
    actionTag,
    actionLabel: String(paperId),
  });
}

function fetchPDFFromExtension(sources: PaperSource[]): Promise<{ data: Blob }> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && typeof chrome !== "undefined") {
      chrome.runtime.sendMessage(EXTENSION_APP_ID, { message: "CHECK_EXTENSION_EXIST" }, reply => {
        if (!reply || !reply.success) {
          return reject();
        }
      });

      const channel = new MessageChannel();
      window.postMessage(
        {
          type: "GET_PDF",
          sources,
        },
        "*",
        [channel.port2]
      );

      channel.port1.onmessage = e => {
        if (e.data.success) {
          console.log("SUCCESS TO GET PDF from EXTENSION");
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

async function fetchPDFFromAPI(bestPdf: PaperPdf | undefined, handleGetBestPdf: () => Promise<PaperPdf> | undefined) {
  let pdf: PaperPdf | undefined = bestPdf;
  if (!pdf) {
    pdf = await handleGetBestPdf();
  }

  if (pdf && pdf.hasBest) {
    const res = await Axios.get(`${getAPIHost()}/proxy/pdf?url=${encodeURIComponent(pdf.url)}`, {
      responseType: "blob",
    });
    return { data: res.data as Blob };
  }
  return null;
}

const PDFViewer: React.FunctionComponent<PDFViewerProps> = props => {
  const { bestPdf, shouldShow, onFailed, onLoadSuccess, dispatch } = props;
  const [percentage, setPercentage] = React.useState(0);
  const [isFetching, setIsFetching] = React.useState(false);
  const [PDFBinary, setPDFBinary] = React.useState<Blob | null>(null);
  const [PDFObject, setPDFObject] = React.useState(null);
  const [extend, setExtend] = React.useState(false);
  const [hadErrorToLoad, setLoadError] = React.useState(false);
  const [succeedToLoad, setSucceed] = React.useState(false);
  const [pageCountToShow, setPageCountToShow] = React.useState(0);
  const wrapperNode = React.useRef<HTMLDivElement | null>(null);
  const actionTag = extend ? "viewLessPDF" : "viewMorePDF";

  const baseBtnStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "150px",
    height: "40px",
  };

  const readAllBtnStyle: React.CSSProperties = {
    ...baseBtnStyle,
    borderRadius: "27.5px",
    border: "1px solid #bbc2d0",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "1px",
    color: "#34495e",
  };

  const downloadPdfBtnStyle: React.CSSProperties = {
    ...baseBtnStyle,
    color: "white",
    backgroundColor: "#3e7fff",
    marginLeft: "16px",
  };

  function handlePDFResult(blob: Blob) {
    setPDFBinary(blob);
    dispatch(ActionCreators.endToLoadingFetchPDF());
    setIsFetching(false);
  }

  useIntervalProgress(() => {
    setPercentage(percentage + 10);
  }, percentage < 90 ? 500 : null);

  React.useEffect(
    () => {
      if (shouldShow && props.sources.length > 0) {
        dispatch(ActionCreators.startToLoadingFetchPDF());
        setIsFetching(true);
        fetchPDFFromExtension(props.sources)
          .then(res => {
            handlePDFResult(res.data);
          })
          .catch(() => {
            return fetchPDFFromAPI(props.bestPdf, props.handleGetBestPdf);
          })
          .then(res => {
            if (res && res.data) {
              handlePDFResult(res.data);
            } else {
              throw new Error();
            }
          })
          .catch(_err => {
            setLoadError(true);
            dispatch(ActionCreators.endToLoadingFetchPDF());
            setIsFetching(false);
            onFailed();
          });
      }
    },
    [props.paperId]
  );

  const getContent = () => {
    if (!PDFObject) return null;

    if (extend) {
      return Array.from(new Array(pageCountToShow), (_el, i) => (
        <Page pdf={PDFObject} width={996} margin={"0 auto"} key={i} pageNumber={i + 1} />
      ));
    } else {
      return (
        <>
          <Page pdf={PDFObject} width={996} margin={"0 auto"} pageNumber={1} />
        </>
      );
    }
  };

  if (isFetching) {
    return (
      <div className={styles.loadingContainerWrapper}>
        <div className={styles.loadingContainer}>
          <CircularProgress size={100} thickness={2} color="inherit" variant="static" value={percentage} />
          <span className={styles.loadingContent}>{`${percentage}%`}</span>
        </div>
      </div>
    );
  }

  if (shouldShow && PDFBinary && bestPdf && bestPdf.hasBest) {
    return (
      <div ref={wrapperNode} className={styles.contentWrapper}>
        <Document
          file={PDFBinary}
          error={null}
          loading={
            <div className={styles.loadingContainer}>
              <CircularProgress size={100} thickness={2} color="inherit" />
            </div>
          }
          onLoadSuccess={(pdf: any) => {
            setPageCountToShow(pdf.numPages);
            setPDFObject(pdf);
            setSucceed(true);
            onLoadSuccess();
          }}
          onLoadError={console.error}
        >
          {getContent()}
        </Document>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
          {succeedToLoad && (
            <>
              {extend ? (
                <ScinapseButton
                  gaCategory="PDF viewer"
                  gaAction="download PDF"
                  style={downloadPdfBtnStyle}
                  target="_blank"
                  href={bestPdf.url}
                  rel="nofollow"
                  content={
                    <span className={styles.downloadBtnWrapper}>
                      <Icon icon="DOWNLOAD" className={styles.downloadIcon} /> Download PDF
                    </span>
                  }
                  onClick={async e => {
                    if (!EnvChecker.isOnServer()) {
                      e.preventDefault();

                      const isBlocked = await blockUnverifiedUser({
                        authLevel: AUTH_LEVEL.VERIFIED,
                        actionArea: "pdfViewer",
                        actionLabel: "downloadPdf",
                        userActionType: "downloadPdf",
                      });

                      if (isBlocked) {
                        return;
                      }

                      trackClickButton("downloadPdf", props.paperId);
                      window.open(bestPdf.url, "_blank");
                    }
                  }}
                  isExternalLink
                  downloadAttr
                />
              ) : (
                <ScinapseButton
                  gaCategory="PDF viewer"
                  gaAction={actionTag}
                  style={readAllBtnStyle}
                  content={
                    <span>
                      READ ALL <Icon icon="ARROW_POINT_TO_UP" className={styles.arrowIcon} />
                    </span>
                  }
                  isLoading={!succeedToLoad && !hadErrorToLoad}
                  disabled={!succeedToLoad}
                  onClick={async () => {
                    const isBlocked = await blockUnverifiedUser({
                      authLevel: AUTH_LEVEL.VERIFIED,
                      actionArea: "pdfViewer",
                      actionLabel: actionTag,
                      userActionType: actionTag,
                    });

                    trackClickButton(actionTag, props.paperId);

                    if (isBlocked) {
                      return;
                    }

                    setExtend(!extend);
                  }}
                />
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
