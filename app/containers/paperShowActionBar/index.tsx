import * as React from "react";
import GlobalDialogManager from "../../helpers/globalDialogManager";
import { withStyles } from "../../helpers/withStylesHelper";
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
            <div className={styles.leftSide} />
            <div className={styles.rightSide}>
              <li className={styles.actionItem}>{this.getCitationBox()}</li>
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
        <div>
          <div
            onClick={() => {
              GlobalDialogManager.openCitationDialog(paper.id);
              trackEvent({ category: "Additional Action", action: "Click Citation Button" });
            }}
            className={styles.actionCite}
          >
            <div>
              <Icon icon={"CITATION_QUOTE"} />
              <span>Cite this paper</span>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
}

export default PaperShowActionBar;
