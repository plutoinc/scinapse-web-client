import * as React from "react";
import { denormalize } from "normalizr";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import GlobalDialogManager from "../../helpers/globalDialogManager";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import { AppState } from "../../reducers";
import { PaperShowActionBarState } from "./reducer";
import { CurrentUser } from "../../model/currentUser";
import { trackEvent } from "../../helpers/handleGA";
import { paperSchema, Paper } from "../../model/paper";
import PaperShowCollectionControlButton from "../paperShowCollectionControlButton";
const styles = require("./actionBar.scss");

interface PaperShowActionBarProps {
  paper: Paper | null;
  paperShowActionBar: PaperShowActionBarState;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
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

const mapStateToProps = (state: AppState) => {
  return {
    paperShowActionBar: state.paperShowActionBar,
    currentUser: state.currentUser,
    paper: denormalize(state.paperShow.paperId, paperSchema, state.entities),
  };
};

export default connect(mapStateToProps)(PaperShowActionBar);
