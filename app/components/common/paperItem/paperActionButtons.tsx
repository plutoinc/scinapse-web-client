import * as React from "react";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { trackAndOpenLink, trackEvent } from "../../../helpers/handleGA";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
import { CurrentUser } from "../../../model/currentUser";
import { Paper } from "../../../model/paper";
import { PaperSource } from "../../../model/paperSource";
import EnvChecker from "../../../helpers/envChecker";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import SourceURLPopover from "../../common/sourceURLPopover";
import { PageType, ActionArea } from "../../../helpers/actionTicketManager/actionTicket";
const styles = require("./paperActionButtons.scss");

interface HandleClickClaim {
  paperId: number;
}

export interface PaperActionButtonsProps {
  paper: Paper;
  currentUser: CurrentUser;
  pageType: PageType;
  actionArea?: ActionArea;
  hasRemoveButton?: boolean;
  handleRemovePaper?: (paper: Paper) => void;
  isRepresentative?: boolean;
  handleToggleRepresentative?: (paper: Paper) => void;
}

export interface PaperActionButtonsState
  extends Readonly<{
      isAdditionalMenuOpen: boolean;
      isSourceDropdownOpen: boolean;
    }> {}

class PaperActionButtons extends React.PureComponent<PaperActionButtonsProps, PaperActionButtonsState> {
  private sourceButton: HTMLDivElement | null;
  private additionalMenuAnchorEl: HTMLElement | null;

  public constructor(props: PaperActionButtonsProps) {
    super(props);

    this.state = {
      isAdditionalMenuOpen: false,
      isSourceDropdownOpen: false,
    };
  }

  public render() {
    return (
      <div className={styles.infoList}>
        {this.getRefButton()}
        {this.getCitedButton()}
        {this.getPDFButton()}
        {this.getSourcesButton()}
        {this.getCitationQuoteButton()}
        {this.getAddCollectionButton()}
        {this.getMoreButton()}
      </div>
    );
  }

  private getPDFButton = () => {
    const { paper, pageType, actionArea } = this.props;

    const pdfSourceRecord =
      paper.urls &&
      paper.urls.find((paperSource: PaperSource) => {
        return (
          paperSource.url.startsWith("https://arxiv.org/pdf/") ||
          (paperSource.url.startsWith("http") && paperSource.url.endsWith(".pdf"))
        );
      });

    if (!!pdfSourceRecord) {
      return (
        <a
          href={pdfSourceRecord.url}
          target="_blank"
          rel="noopener"
          onClick={() => {
            trackAndOpenLink("searchItemPdfButton");
            ActionTicketManager.trackTicket({
              pageType,
              actionType: "fire",
              actionArea: actionArea || pageType,
              actionTag: "downloadPdf",
              actionLabel: String(paper.id),
            });
          }}
          style={!pdfSourceRecord.url ? { display: "none" } : undefined}
          className={styles.pdfButton}
        >
          <Icon className={styles.pdfIconWrapper} icon="DOWNLOAD" />
          <span>Download PDF</span>
        </a>
      );
    }
  };

  private getSourcesButton = () => {
    const { paper, pageType, actionArea } = this.props;
    const { isSourceDropdownOpen } = this.state;

    if (paper.urls.length === 0) {
      return null;
    }

    if (paper.urls.length === 1) {
      return (
        <a
          href={paper.urls[0].url}
          target="_blank"
          rel="noopener"
          className={styles.sourceButton}
          onClick={this.handleToggleSourceDropdown}
        >
          <Icon className={styles.sourceButtonIcon} icon="EXTERNAL_SOURCE" />
          <span>Source</span>
        </a>
      );
    }

    return (
      <SourceURLPopover
        buttonEl={
          <div
            className={styles.sourceButton}
            ref={el => (this.sourceButton = el)}
            onClick={this.handleToggleSourceDropdown}
          >
            <Icon className={styles.sourceButtonIcon} icon="EXTERNAL_SOURCE" />
            <span>Source</span>
          </div>
        }
        isOpen={isSourceDropdownOpen}
        handleCloseFunc={this.handleCloseSourceDropdown}
        anchorEl={this.sourceButton!}
        paperSources={paper.urls}
        pageType={pageType}
        paperId={paper.id}
        actionArea={actionArea}
      />
    );
  };

  private handleCloseSourceDropdown = (e: any) => {
    const path = e.path || (e.composedPath && e.composedPath());

    if (path.includes(this.sourceButton)) {
      return;
    }

    this.setState(prevState => ({ ...prevState, isSourceDropdownOpen: false }));
  };

  private handleToggleSourceDropdown = () => {
    this.setState(prevState => ({ ...prevState, isSourceDropdownOpen: !this.state.isSourceDropdownOpen }));
  };

  private getAddCollectionButton = () => {
    const { paper, pageType, actionArea } = this.props;

    return (
      <button
        className={styles.addCollectionBtnWrapper}
        onClick={() => {
          GlobalDialogManager.openCollectionDialog(paper.id);
          trackEvent({
            category: "Additional Action",
            action: "Click [Add To Collection] Button",
          });
          ActionTicketManager.trackTicket({
            pageType,
            actionType: "fire",
            actionArea: actionArea || pageType,
            actionTag: "addToCollection",
            actionLabel: String(paper.id),
          });
        }}
      >
        <Icon className={styles.plusIcon} icon="SMALL_PLUS" />
        <span>Add To Collection</span>
      </button>
    );
  };

  private getRefButton = () => {
    const { paper, pageType, actionArea } = this.props;

    if (!paper.referenceCount) {
      return null;
    } else {
      return (
        <Link
          to={{
            pathname: `/papers/${paper.id}`,
            hash: "references",
          }}
          onClick={() => {
            if (!EnvChecker.isOnServer()) {
              trackEvent({
                category: "New Paper Show",
                action: "Click Ref Button in paperItem",
                label: `Link to references paper - /papers/${paper.id} `,
              });
              ActionTicketManager.trackTicket({
                pageType,
                actionType: "fire",
                actionArea: actionArea || pageType,
                actionTag: "refList",
                actionLabel: String(paper.id),
              });
            }
          }}
          className={styles.referenceButton}
        >
          <span>{`Ref ${paper.referenceCount}`}</span>
        </Link>
      );
    }
  };

  private getCitedButton = () => {
    const { paper, pageType, actionArea } = this.props;

    if (!paper.citedCount) {
      return null;
    } else {
      return (
        <Link
          to={{
            pathname: `/papers/${paper.id}`,
            hash: "cited",
          }}
          onClick={() => {
            trackEvent({
              category: "New Paper Show",
              action: "Click Cited Button in paperItem",
              label: `Link to citation paper - /papers/${paper.id} `,
            });
            ActionTicketManager.trackTicket({
              pageType,
              actionType: "fire",
              actionArea: actionArea || pageType,
              actionTag: "citedList",
              actionLabel: String(paper.id),
            });
          }}
          className={styles.citedButton}
        >
          <span>{`Cited ${paper.citedCount}`}</span>
        </Link>
      );
    }
  };

  private getCitationQuoteButton = () => {
    const { paper, pageType, actionArea } = this.props;

    if (paper.doi) {
      return (
        <span className={styles.DOIMetaButtonsWrapper}>
          <span
            className={styles.citationIconWrapper}
            onClick={() => {
              GlobalDialogManager.openCitationDialog(paper.id);
              trackEvent({
                category: "Additional action",
                action: "Click Citation Button",
              });
              ActionTicketManager.trackTicket({
                pageType,
                actionType: "fire",
                actionArea: actionArea || pageType,
                actionTag: "citePaper",
                actionLabel: String(paper.id),
              });
            }}
          >
            <Icon className={styles.citationIcon} icon="CITATION_QUOTE" />
            <span>Cite this paper</span>
          </span>
        </span>
      );
    } else {
      return null;
    }
  };

  private additionalMenuItems = () => {
    const { paper, handleRemovePaper, hasRemoveButton, isRepresentative, handleToggleRepresentative } = this.props;
    return (
      <div className={styles.menuItems}>
        {hasRemoveButton ? (
          <MenuItem
            classes={{ root: styles.additionalMenuItem }}
            onClick={() => {
              if (handleRemovePaper) {
                handleRemovePaper(paper);
              }
              this.closeAdditionalMenu();
            }}
          >
            Delete this paper
          </MenuItem>
        ) : null}
        {handleToggleRepresentative && (
          <MenuItem
            classes={{ root: styles.additionalMenuItem }}
            onClick={() => {
              handleToggleRepresentative(paper);
              this.closeAdditionalMenu();
            }}
          >
            {isRepresentative ? "Remove from representative publications" : "Add to representative publications"}
          </MenuItem>
        )}
        <MenuItem
          classes={{ root: styles.additionalMenuItem }}
          onClick={() => {
            this.handleClickClaim({
              paperId: this.props.paper.id,
            });
            this.closeAdditionalMenu();
          }}
        >
          Suggest change
        </MenuItem>
      </div>
    );
  };

  private getMoreButton = () => {
    return (
      <div className={styles.claimButton}>
        <div ref={el => (this.additionalMenuAnchorEl = el)}>
          <IconButton onClick={this.openAdditionalMenu} classes={{ root: styles.additionalMenuIcon }}>
            <Icon className={styles.ellipsisIcon} icon="ELLIPSIS" />
          </IconButton>
        </div>
        <Popper
          className={styles.speechBubble}
          anchorEl={this.additionalMenuAnchorEl!}
          placement="bottom-end"
          open={this.state.isAdditionalMenuOpen}
        >
          <ClickAwayListener onClickAway={this.closeAdditionalMenu}>
            <div className={styles.contentWrapper}>{this.additionalMenuItems()}</div>
          </ClickAwayListener>
        </Popper>
      </div>
    );
  };

  private openAdditionalMenu = () => {
    this.setState({
      isAdditionalMenuOpen: true,
    });
  };

  private closeAdditionalMenu = () => {
    this.setState({
      isAdditionalMenuOpen: false,
    });
  };

  private handleClickClaim = ({ paperId }: HandleClickClaim) => {
    const targetId = paperId;

    if (!EnvChecker.isOnServer()) {
      window.open(
        // tslint:disable-next-line:max-line-length
        `https://docs.google.com/forms/d/e/1FAIpQLScS76iC1pNdq94mMlxSGjcp_BuBM4WqlTpfPDt19LgVJ-t7Ng/viewform?usp=pp_url&entry.130188959=${targetId}&entry.1298741478`,
        "_blank"
      );
    }
  };
}

export default withStyles<typeof PaperActionButtons>(styles)(PaperActionButtons);
