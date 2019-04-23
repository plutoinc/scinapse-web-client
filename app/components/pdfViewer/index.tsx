import * as React from "react";
import Axios from "axios";
import { Dispatch } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import { withStyles } from "../../helpers/withStylesHelper";
import ScinapseButton from "../common/scinapseButton";
import ActionTicketManager from "../../helpers/actionTicketManager";
import { shouldBlockToSignUp } from "../../helpers/shouldBlockToSignUp";
import Icon from "../../icons";
import { PaperPdf } from "../../model/paper";
import { ActionCreators } from "../../actions/actionTypes";
const { Document, Page } = require("react-pdf");
const styles = require("./pdfViewer.scss");

interface PDFViewerProps {
  dispatch: Dispatch<any>;
  paperId: number;
  shouldShow: boolean;
  filename: string;
  bestPdf?: PaperPdf;
  handleGetBestPdf: () => void;
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

const PDFViewer: React.FunctionComponent<PDFViewerProps> = props => {
  const { bestPdf, shouldShow, onFailed, onLoadSuccess, filename, handleGetBestPdf, dispatch } = props;
  const [percentage, setPercentage] = React.useState(0);
  const [isFetching, setIsFetching] = React.useState(false);
  const [PDFBinary, setPDFBinary] = React.useState(null);
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

  useIntervalProgress(() => {
    setPercentage(percentage + 10);
  }, percentage < 90 ? 500 : null);

  React.useEffect(
    () => {
      if (shouldShow) {
        if (!bestPdf) {
          handleGetBestPdf();
        } else if (bestPdf && bestPdf.hasBest) {
          setIsFetching(true);
          dispatch(ActionCreators.startToLoadingFetchPDF());
          Axios.get(
            `https://lvr8qqubzk.execute-api.us-east-1.amazonaws.com/prod/get-pdf?pdf_url=${
              bestPdf.url
            }&title=${filename}`,
            {
              responseType: "blob",
            }
          )
            .then(res => {
              setPDFBinary(res.data);
              dispatch(ActionCreators.endToLoadingFetchPDF());
              setIsFetching(false);
            })
            .catch(_err => {
              setLoadError(true);
              dispatch(ActionCreators.endToLoadingFetchPDF());
              setIsFetching(false);
              onFailed();
            });
        } else if (bestPdf && !bestPdf.hasBest) {
          setPDFBinary(null);
          dispatch(ActionCreators.endToLoadingFetchPDF());
          setIsFetching(false);
        }
      }
    },
    [bestPdf]
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

        <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
          {succeedToLoad && (
            <>
              {extend ? (
                <ScinapseButton
                  gaCategory="PDF viewer"
                  gaAction="download PDF"
                  style={downloadPdfBtnStyle}
                  target="_blank"
                  href={bestPdf.url}
                  content={
                    <span className={styles.downloadBtnWrapper}>
                      <Icon icon="DOWNLOAD" className={styles.downloadIcon} /> Download PDF
                    </span>
                  }
                  onClick={async e => {
                    if (await shouldBlockToSignUp("pdfViewer", "downloadPDF")) {
                      e.preventDefault();
                      return;
                    }
                    trackClickButton("downloadPdf", props.paperId);
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
                    if (await shouldBlockToSignUp("pdfViewer", "viewMorePDF")) {
                      return;
                    }
                    trackClickButton(actionTag, props.paperId);
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

function trackClickButton(actionTag: Scinapse.ActionTicket.ActionTagType, paperId: number) {
  ActionTicketManager.trackTicket({
    pageType: "paperShow",
    actionType: "fire",
    actionArea: "pdfViewer",
    actionTag,
    actionLabel: String(paperId),
  });
}

export default withStyles<typeof PDFViewer>(styles)(PDFViewer);
