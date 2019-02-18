import * as React from "react";
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
  const [extend, setExtend] = React.useState(false);
  const [hadErrorToLoad, setLoadError] = React.useState(false);
  const [succeedToLoad, setSucceed] = React.useState(false);
  const [pageCountToShow, setPageCountToShow] = React.useState(0);
  const wrapperNode = React.useRef<HTMLDivElement | null>(null);

  console.log("RENDERING FIRED");

  const getContent = () => {
    if (extend) {
      return Array.from(new Array(pageCountToShow), (_el, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      ));
    } else {
      return <Page pageNumber={1} />;
    }
  };

  if (pdfURL && shouldShow) {
    return (
      <div ref={wrapperNode}>
        <Document
          // tslint:disable-next-line:max-line-length
          file={`https://u5ctiiqdab.execute-api.us-east-1.amazonaws.com/dev/get-pdf?pdf_url=${pdfURL}&title=${filename}`}
          error={null}
          loading={
            <div className={styles.loadingContainer}>
              <ArticleSpinner />
            </div>
          }
          onLoadError={() => {
            setLoadError(true);
            onFailed();
          }}
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
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#3e7fff",
                  width: "154px",
                  height: "40px",
                }}
                content={extend ? "View Less" : "View More"}
                isLoading={!succeedToLoad && !hadErrorToLoad}
                disabled={!succeedToLoad}
                onClick={() => {
                  setExtend(true);
                  wrapperNode.current && wrapperNode.current.scrollIntoView();
                }}
              />
              <ScinapseButton
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#3e7fff",
                  width: "154px",
                  height: "40px",
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
