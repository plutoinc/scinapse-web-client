import * as React from "react";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { trackEvent } from "../../../helpers/handleGA";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
import { CurrentUser } from "../../../model/currentUser";
import { Paper } from "../../../model/paper";
import EnvChecker from "../../../helpers/envChecker";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { getPDFLink } from "../../../helpers/getPDFLink";
const styles = require("./paperActionButtons.scss");

interface HandleClickClaim {
  paperId: number;
}

export interface PaperActionButtonsProps {
  paper: Paper;
  currentUser: CurrentUser;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  hasRemoveButton?: boolean;
  handleRemovePaper?: (paper: Paper) => void;
  isRepresentative?: boolean;
  handleToggleRepresentative?: (paper: Paper) => void;
}

export interface PaperActionButtonsState
  extends Readonly<{
      isAdditionalMenuOpen: boolean;
    }> {}

class PaperActionButtons extends React.PureComponent<PaperActionButtonsProps, PaperActionButtonsState> {
  private additionalMenuAnchorEl: HTMLElement | null;

  public constructor(props: PaperActionButtonsProps) {
    super(props);

    this.state = {
      isAdditionalMenuOpen: false,
    };
  }

  public render() {
    return (
      <div className={styles.infoList}>
        {this.getRefButton()}
        {this.getCitedButton()}
        {this.getPDFSourcesButton()}
        {this.getCitationQuoteButton()}
        {this.getAddCollectionButton()}
        {this.getMoreButton()}
      </div>
    );
  }

  private getPDFSourcesButton = () => {
    const { paper, pageType, actionArea } = this.props;
    const pdfSourceRecord = getPDFLink(paper.urls);

    const buttonContent = pdfSourceRecord ? (
      <>
        <Icon className={styles.pdfIconWrapper} icon="DOWNLOAD" />
        <span>Download PDF</span>
      </>
    ) : (
      <>
        <Icon className={styles.sourceButtonIcon} icon="EXTERNAL_SOURCE" />
        <span>Source</span>
      </>
    );

    if (paper.urls.length === 0) {
      return null;
    }
    return (
      <a
        href={paper.urls[0].url}
        target="_blank"
        rel="noopener"
        className={styles.sourceButton}
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType,
            actionType: "fire",
            actionArea: actionArea || pageType,
            actionTag: pdfSourceRecord ? "downloadPdf" : "source",
            actionLabel: String(paper.id),
          });
        }}
      >
        {buttonContent}
      </a>
    );
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
