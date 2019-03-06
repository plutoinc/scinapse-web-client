import * as React from "react";
import Axios from "axios";
import ArticleSpinner from "../common/spinner/articleSpinner";
import { withStyles } from "../../helpers/withStylesHelper";
import ScinapseButton from "../common/scinapseButton";
const { Document, Page } = require("react-pdf");
const styles = require("./pdfViewer.scss");

interface PDFViewerProps {
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
  const [extend, setExtend] = React.useState(false);
  const [hadErrorToLoad, setLoadError] = React.useState(false);
  const [succeedToLoad, setSucceed] = React.useState(false);
  const [pageCountToShow, setPageCountToShow] = React.useState(0);
  const wrapperNode = React.useRef<HTMLDivElement | null>(null);

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
    if (extend) {
      return Array.from(new Array(pageCountToShow), (_el, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      ));
    } else {
      return <Page pageNumber={1} />;
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
          // tslint:disable-next-line:max-line-length
          file={PDFBinary}
          error={null}
          loading={
            <div className={styles.loadingContainer}>
              <ArticleSpinner />
            </div>
          }
          onLoadSuccess={(document: any) => {
            setPageCountToShow(document.numPages);
            setSucceed(true);
            onLoadSuccess();
          }}
        >
          {getContent()}
        </Document>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "16px", marginBottom: "65px" }}>
          {succeedToLoad && (
            <>
              <ScinapseButton
                style={{ ...baseBtnStyle, backgroundColor: "#3e7fff" }}
                content={extend ? "View Less" : "View More"}
                isLoading={!succeedToLoad && !hadErrorToLoad}
                disabled={!succeedToLoad}
                onClick={() => {
                  setExtend(!extend);
                  if (extend && wrapperNode.current) {
                    wrapperNode.current.scrollIntoView();
                  }
                }}
              />
              <ScinapseButton
                style={{
                  ...baseBtnStyle,
                  color: "#3e7fff",
                  border: "1px solid #3e7fff",
                  marginLeft: "16px",
                }}
                isExternalLink={true}
                downloadAttr={true}
                target={"_blank"}
                href={pdfURL}
                content="Download PDF"
              />
            </>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default withStyles<typeof PDFViewer>(styles)(PDFViewer);
