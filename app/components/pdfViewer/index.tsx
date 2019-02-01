import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ArticleSpinner from "../common/spinner/articleSpinner";
import EnvChecker from "../../helpers/envChecker";
import { AppState } from "../../reducers";
import { LayoutState, UserDevice } from "../layouts/records";
import ScinapseButton from "../common/scinapseButton";
const { Document, Page } = require("react-pdf");

interface PDFViewerProps {
  layout: LayoutState;
  dispatch: Dispatch<any>;
  filename: string;
  pdfURL?: string;
  onLoadSuccess: () => void;
}

interface PDFViewerState {
  isFullNode: boolean;
  hadError: boolean;
  numPages: number | null;
}

class PDFViewer extends React.PureComponent<PDFViewerProps, PDFViewerState> {
  private wrapperNode: HTMLDivElement | null;
  public constructor(props: PDFViewerProps) {
    super(props);

    this.state = {
      isFullNode: false,
      hadError: false,
      numPages: null,
    };
  }

  public render() {
    const { layout, pdfURL, filename, onLoadSuccess } = this.props;

    if (pdfURL && !EnvChecker.isOnServer() && layout.userDevice === UserDevice.DESKTOP) {
      return (
        <div ref={el => (this.wrapperNode = el)}>
          <Document
            // tslint:disable-next-line:max-line-length
            file={`https://xsn4er593c.execute-api.us-east-1.amazonaws.com/dev/getPdf?pdfUrl=${pdfURL}&title=${filename}`}
            error={null}
            loading={<ArticleSpinner style={{ margin: "200px auto" }} />}
            onLoadError={() => {
              this.setState(prevState => ({ ...prevState, hadError: true }));
            }}
            onLoadSuccess={(document: any) => {
              this.onDocumentLoadSuccess(document);
              onLoadSuccess();
            }}
          >
            {this.getContent()}
          </Document>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
            <ScinapseButton
              style={{
                backgroundColor: "#3e7fff",
              }}
              content="View More"
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
                color: "#3e7fff",
              }}
              isExternalLink={true}
              downloadAttr={true}
              target={"_blank"}
              // tslint:disable-next-line:max-line-length
              href={`https://xsn4er593c.execute-api.us-east-1.amazonaws.com/dev/getPdf?pdfUrl=${pdfURL}&title=${filename}`}
              content="Download PDF"
            />
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
