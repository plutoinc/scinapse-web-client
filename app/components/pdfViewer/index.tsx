import * as React from "react";
import Axios from "axios";
import ArticleSpinner from "../common/spinner/articleSpinner";
import { withStyles } from "../../helpers/withStylesHelper";
import ScinapseButton from "../common/scinapseButton";
import ActionTicketManager from "../../helpers/actionTicketManager";
import { shouldBlockToSignUp } from "../../helpers/shouldBlockToSignUp";
const { Document, Page } = require("react-pdf");
const styles = require("./pdfViewer.scss");

interface PDFViewerProps {
  paperId: number;
  shouldShow: boolean;
  filename: string;
  pdfURL?: string;
  onLoadSuccess: () => void;
  onFailed: () => void;
}

const PDFViewer: React.FunctionComponent<PDFViewerProps> = props => {
  const { pdfURL, shouldShow, onFailed, onLoadSuccess, filename } = props;
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
    width: "154px",
    height: "40px",
  };

  React.useEffect(
    () => {
      if (shouldShow) {
        setIsFetching(true);
        Axios.get(
          `https://lvr8qqubzk.execute-api.us-east-1.amazonaws.com/prod/get-pdf?pdf_url=${pdfURL}&title=${filename}`,
          {
            responseType: "blob",
          }
        )
          .then(res => {
            setPDFBinary(res.data);
            setIsFetching(false);
          })
          .catch(_err => {
            setLoadError(true);
            setIsFetching(false);
            onFailed();
          });
      }
    },
    [pdfURL]
  );

  const getContent = () => {
    if (!PDFObject) return null;

    if (extend) {
      return Array.from(new Array(pageCountToShow), (_el, i) => (
        <Page pdf={PDFObject} width={792} key={i} pageNumber={i + 1} />
      ));
    } else {
      return (
        <>
          <Page pdf={PDFObject} width={792} pageNumber={1} />
        </>
      );
    }
  };

  if (isFetching) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner />
      </div>
    );
  }

  if (shouldShow && PDFBinary) {
    return (
      <div ref={wrapperNode}>
        <Document
          file={PDFBinary}
          error={null}
          loading={
            <div className={styles.loadingContainer}>
              <ArticleSpinner />
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

        <div style={{ display: "flex", justifyContent: "center", marginTop: "16px", marginBottom: "65px" }}>
          {succeedToLoad && (
            <>
              <ScinapseButton
                gaCategory="PDF viewer"
                gaAction={actionTag}
                style={{ ...baseBtnStyle, backgroundColor: "#3e7fff" }}
                content={extend ? "View Less" : "View More"}
                isLoading={!succeedToLoad && !hadErrorToLoad}
                disabled={!succeedToLoad}
                onClick={() => {
                  if (!extend && shouldBlockToSignUp("pdfViewer", "viewMorePDF")) {
                    return;
                  }
                  trackClickButton(actionTag, props.paperId);
                  setExtend(!extend);
                  if (extend && wrapperNode.current) {
                    wrapperNode.current.scrollIntoView();
                  }
                }}
              />
              <ScinapseButton
                gaCategory="PDF viewer"
                gaAction="download PDF"
                style={{
                  ...baseBtnStyle,
                  color: "#3e7fff",
                  border: "1px solid #3e7fff",
                  marginLeft: "16px",
                }}
                target="_blank"
                href={pdfURL}
                content="Download PDF"
                onClick={e => {
                  if (shouldBlockToSignUp("pdfViewer", "downloadPDF")) {
                    e.preventDefault();
                    return;
                  }
                  trackClickButton("downloadPdf", props.paperId);
                }}
                isExternalLink
                downloadAttr
              />
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
