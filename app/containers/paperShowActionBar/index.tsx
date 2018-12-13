import * as React from "react";
import GlobalDialogManager from "../../helpers/globalDialogManager";
import { withStyles } from "../../helpers/withStylesHelper";
import PdfSourceButton from "../../components/paperShow/components/pdfSourceButton";
import Icon from "../../icons";
import { trackEvent } from "../../helpers/handleGA";
import { Paper } from "../../model/paper";
import PaperShowCollectionControlButton from "../paperShowCollectionControlButton";
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
                <PdfSourceButton paper={paper} />
              </li>
              <li className={styles.actionItem}>{this.getCitationBox()}</li>
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

  private getCitationBox = () => {
    const { paper } = this.props;

    if (paper && paper.id) {
      return (
        <div
          className={styles.citeButton}
          onClick={() => {
            GlobalDialogManager.openCitationDialog(paper.id);
            trackEvent({
              category: "New Paper Show",
              action: "Click Citation Button in PaperShow ActionBar",
              label: `Try to cite this Paper - ID : ${paper.id}`,
            });
          }}
        >
          <div>
            <Icon icon={"CITATION_QUOTE"} />
            <span>Cite this paper</span>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
}

export default PaperShowActionBar;
