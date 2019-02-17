import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ArticleSpinner from "../common/spinner/articleSpinner";
import { AppState } from "../../reducers";
import { LayoutState, UserDevice } from "../layouts/records";
import ScinapseButton from "../common/scinapseButton";
import { withStyles } from "../../helpers/withStylesHelper";
const { Document, Page } = require("react-pdf");
const styles = require("./pdfViewer.scss");

interface PDFViewerProps {
  layout: LayoutState;
  dispatch: Dispatch<any>;
  filename: string;
  pdfURL?: string;
  onLoadSuccess: () => void;
  onFailed: () => void;
}

interface PDFViewerState {
  isFullNode: boolean;
  hadError: boolean;
  succeeded: boolean;
  numPages: number | null;
}

@withStyles<typeof PDFViewer>(styles)
class PDFViewer extends React.Component<PDFViewerProps, PDFViewerState> {
  private wrapperNode: HTMLDivElement | null;
  public constructor(props: PDFViewerProps) {
    super(props);

    this.state = {
      isFullNode: false,
      hadError: false,
      succeeded: false,
      numPages: null,
    };
  }

  public render() {
    const { layout, pdfURL, filename, onLoadSuccess, onFailed } = this.props;
    const { isFullNode, succeeded, hadError } = this.state;

    console.log("PDF VIEWER RENDER FIRED!");

    if (pdfURL && layout.userDevice === UserDevice.DESKTOP) {
      return (
        <div ref={el => (this.wrapperNode = el)}>
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
              onFailed();
              this.setState(prevState => ({ ...prevState, hadError: true }));
            }}
            onLoadSuccess={(document: any) => {
              this.onDocumentLoadSuccess(document);
              this.setState(prevState => ({ ...prevState, succeeded: true }));
              onLoadSuccess();
            }}
          >
            {this.getContent()}
          </Document>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "16px", marginBottom: "65px" }}>
            {succeeded && (
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
                  content={isFullNode ? "View Less" : "View More"}
                  isLoading={!succeeded && !hadError}
                  disabled={!succeeded}
                  onClick={() => {
                    this.setState(
                      prevState => ({ ...prevState, isFullNode: !this.state.isFullNode }),
                      () => {
                        if (this.wrapperNode && !this.state.isFullNode) {
                          this.wrapperNode.scrollIntoView();
                        }
                      }
                    );
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
  }

  private getContent = () => {
    const { isFullNode, numPages } = this.state;

    if (isFullNode) {
      return Array.from(new Array(numPages), (_el, index) => <Page key={`page_${index + 1}`} pageNumber={index + 1} />);
    } else {
      return <Page pageNumber={1} />;
    }
  };

  private onDocumentLoadSuccess = (document: any) => {
    const { numPages } = document;
    this.setState({
      numPages,
    });
  };
}

function mapStateToProps(appState: AppState) {
  return {
    layout: appState.layout,
  };
}

export default connect(mapStateToProps)(PDFViewer);
