import * as React from "react";
import GlobalDialogManager from "../../helpers/globalDialogManager";
import { withStyles } from "../../helpers/withStylesHelper";
import PdfSourceButton from "../../components/paperShow/components/pdfSourceButton";
import Icon from "../../icons";
import { trackEvent } from "../../helpers/handleGA";
import { Paper } from "../../model/paper";
import PaperShowCollectionControlButton from "../paperShowCollectionControlButton";
import ActionTicketManager from "../../helpers/actionTicketManager";
import SourceURLPopover from "../../components/common/sourceURLPopover";
const styles = require("./actionBar.scss");

interface PaperShowActionBarProps {
  paper: Paper | null;
}

interface PaperShowActionBarState {
  isOpen: boolean;
}

@withStyles<typeof PaperShowActionBar>(styles)
class PaperShowActionBar extends React.PureComponent<PaperShowActionBarProps, PaperShowActionBarState> {
  private sourceButton: HTMLDivElement | null;

  public constructor(props: PaperShowActionBarProps) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  public render() {
    const { paper } = this.props;
    const { isOpen } = this.state;

    if (paper) {
      return (
        <div className={styles.actionBar}>
          <ul className={styles.actions}>
            <div className={styles.leftSide}>
              <li className={styles.actionItem}>
                <PdfSourceButton paper={paper} />
              </li>
              <li className={styles.actionItem}>
                <SourceURLPopover
                  buttonEl={
                    <div
                      className={styles.sourceButton}
                      ref={el => (this.sourceButton = el)}
                      onClick={this.handleToggleSourceDropdown}
                    >
                      <Icon className={styles.sourceButtonIcon} icon="EXTERNAL_SOURCE" />
                      <span>View in Source</span>
                    </div>
                  }
                  isOpen={isOpen}
                  handleCloseFunc={this.handleCloseSourceDropdown}
                  anchorEl={this.sourceButton!}
                  paperSources={paper.urls}
                  pageType="paperShow"
                  paperId={paper.id}
                  actionArea="paperDescription"
                />
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

  private handleToggleSourceDropdown = () => {
    this.setState(prevState => ({ ...prevState, isOpen: !this.state.isOpen }));
  };

  private handleCloseSourceDropdown = (e: any) => {
    const path = e.path || (e.composedPath && e.composedPath());

    if (path.includes(this.sourceButton)) {
      return;
    }

    this.setState(prevState => ({ ...prevState, isOpen: false }));
  };

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
            ActionTicketManager.trackTicket({
              pageType: "paperShow",
              actionType: "fire",
              actionArea: "paperDescription",
              actionTag: "citePaper",
              actionLabel: String(paper.id),
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
