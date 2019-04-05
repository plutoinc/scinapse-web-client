import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import PdfSourceButton from "../../components/paperShow/components/pdfSourceButton";
import { Paper } from "../../model/paper";
import PaperShowCollectionControlButton from "../paperShowCollectionControlButton";
import CiteBox from "./components/citeBox";
const styles = require("./actionBar.scss");

interface PaperShowActionBarProps {
  paper: Paper | null;
}

@withStyles<typeof PaperShowActionBar>(styles)
class PaperShowActionBar extends React.PureComponent<PaperShowActionBarProps> {
  public render() {
    const { paper } = this.props;

    if (paper) {
      return (
        <div className={styles.actionBar}>
          <ul className={styles.actions}>
            <div className={styles.leftSide}>
              <li className={styles.actionItem}>
                <PdfSourceButton paper={paper} fullTextAB="A" />
              </li>
              <li className={styles.actionItem}>
                <CiteBox paper={paper} />
              </li>
            </div>
            <div className={styles.rightSide}>
              <PaperShowCollectionControlButton />
            </div>
          </ul>
        </div>
      );
    }
    return null;
  }
}

export default PaperShowActionBar;
