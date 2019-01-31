import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ArticleSpinner from "../common/spinner/articleSpinner";
import EnvChecker from "../../helpers/envChecker";
import { AppState } from "../../reducers";
import { LayoutState, UserDevice } from "../layouts/records";
const { pdfjs, Document, Page } = require("react-pdf");
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFViewerProps {
  layout: LayoutState;
  dispatch: Dispatch<any>;
  filename: string;
  pdfURL?: string;
  onLoadSuccess: () => void;
}

interface PDFViewerState {
  hadError: boolean;
}

class PDFViewer extends React.PureComponent<PDFViewerProps, PDFViewerState> {
  public constructor(props: PDFViewerProps) {
    super(props);

    this.state = {
      hadError: false,
    };
  }

  public render() {
    const { layout, pdfURL, filename } = this.props;

    if (pdfURL && !EnvChecker.isOnServer() && layout.userDevice === UserDevice.DESKTOP) {
      return (
        <Document
          file={`https://xsn4er593c.execute-api.us-east-1.amazonaws.com/dev/getPdf?pdfUrl=${pdfURL}&title=${filename}`}
          error={null}
          loading={<ArticleSpinner style={{ margin: "200px auto" }} />}
          onLoadError={() => {
            this.setState(prevState => ({ ...prevState, hadError: true }));
          }}
        >
          <Page pageNumber={1} />
        </Document>
      );
    }
    return null;
  }
}

function mapStateToProps(appState: AppState) {
  return {
    layout: appState.layout,
  };
}

export default connect(mapStateToProps)(PDFViewer);
