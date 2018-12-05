import * as React from "react";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import BubblePopover from "../../common/bubblePopover";
import MenuItem from "@material-ui/core/MenuItem";
import { trackAndOpenLink, trackEvent } from "../../../helpers/handleGA";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
import { CurrentUser } from "../../../model/currentUser";
import { Paper } from "../../../model/paper";
import { PaperSource } from "../../../model/paperSource";
import EnvChecker from "../../../helpers/envChecker";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
const styles = require("./paperActionButtons.scss");

interface HandleClickClaim {
  paperId: number;
}

export interface PaperActionButtonsProps {
  paper: Paper;
  currentUser: CurrentUser;
  hasRemoveButton?: boolean;
  handleRemovePaper?: (paper: Paper) => void;
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
    const { paper } = this.props;
    const { referenceCount, citedCount } = paper;

    const pdfSourceRecord =
      paper.urls &&
      paper.urls.find((paperSource: PaperSource) => {
        return (
          paperSource.url.startsWith("https://arxiv.org/pdf/") ||
          (paperSource.url.startsWith("http") && paperSource.url.endsWith(".pdf"))
        );
      });

    let pdfSourceUrl;
    if (!!pdfSourceRecord) {
      pdfSourceUrl = pdfSourceRecord.url;
    }

    let source: string;
    if (!!paper.doi) {
      source = `https://doi.org/${paper.doi}`;
    } else if (paper.urls && paper.urls.length > 0) {
      source = paper.urls[0].url;
    } else {
      source = "";
    }

    const shouldBeEmptyInfoList = !referenceCount && !citedCount && !paper.doi && !pdfSourceUrl && !source;

    if (shouldBeEmptyInfoList) {
      return <div style={{ height: 16 }} />;
    }

    return (
      <div className={styles.infoList}>
        {this.getRefButton()}
        {this.getCitedButton()}

        {pdfSourceUrl ? (
          <a
            href={pdfSourceUrl}
            target="_blank"
            onClick={() => {
              trackAndOpenLink("searchItemPdfButton");
            }}
            style={!pdfSourceUrl ? { display: "none" } : {}}
            className={styles.pdfButton}
          >
            <Icon className={styles.pdfIconWrapper} icon="DOWNLOAD" />
            <span>Download Pdf</span>
          </a>
        ) : (
          <a
            onClick={() => {
              trackAndOpenLink("search-item-source-button");
            }}
            className={styles.sourceButton}
            target="_blank"
            href={source}
          >
            <Icon className={styles.sourceButtonIcon} icon="EXTERNAL_SOURCE" />
            <span>Source</span>
          </a>
        )}
        {this.getCitationQuoteButton()}
        {this.getAddCollectionButton()}
        {this.getMoreButton()}
      </div>
    );
  }

  private getAddCollectionButton = () => {
    const { paper } = this.props;

    return (
      <button
        className={styles.addCollectionBtnWrapper}
        onClick={() => {
          GlobalDialogManager.openCollectionDialog(paper.id);
          trackEvent({
            category: "Additional Action",
            action: "Click [Add To Collection] Button",
          });
        }}
      >
        <Icon className={styles.plusIcon} icon="SMALL_PLUS" />
        <span>Add To Collection</span>
      </button>
    );
  };

  private getRefButton = () => {
    if (!this.props.paper.referenceCount) {
      return null;
    } else {
      return (
        <Link
          to={{
            pathname: `/papers/${this.props.paper.id}`,
            hash: "references",
          }}
          onClick={() => {
            trackEvent({
              category: "Flow to Paper Show",
              action: "Click Ref Button",
              label: "",
            });
          }}
          className={styles.referenceButton}
        >
          <span>{`Ref ${this.props.paper.referenceCount}`}</span>
        </Link>
      );
    }
  };

  private getCitedButton = () => {
    if (!this.props.paper.citedCount) {
      return null;
    } else {
      return (
        <Link
          to={{
            pathname: `/papers/${this.props.paper.id}`,
            hash: "cited",
          }}
          onClick={() => {
            trackEvent({
              category: "Flow to Paper Show",
              action: "Click Cited Button",
              label: "",
            });
          }}
          className={styles.citedButton}
        >
          <span>{`Cited ${this.props.paper.citedCount}`}</span>
        </Link>
      );
    }
  };

  private getCitationQuoteButton = () => {
    if (this.props.paper.doi) {
      return (
        <span className={styles.DOIMetaButtonsWrapper}>
          <span
            className={styles.citationIconWrapper}
            onClick={() => {
              GlobalDialogManager.openCitationDialog(this.props.paper.id);
              trackEvent({
                category: "Additional action",
                action: "Click Citation Button",
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
    const { paper, handleRemovePaper, hasRemoveButton } = this.props;
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
    // const { paper, handleRemovePaper, hasRemoveButton } = this.props;

    return (
      <div className={styles.claimButton}>
        <div ref={el => (this.additionalMenuAnchorEl = el)}>
          <IconButton onClick={this.openAdditionalMenu} classes={{ root: styles.additionalMenuIcon }}>
            <Icon className={styles.ellipsisIcon} icon="ELLIPSIS" />
          </IconButton>
        </div>
        <BubblePopover
          className={styles.speechBubble}
          anchorEl={this.additionalMenuAnchorEl!}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={this.state.isAdditionalMenuOpen}
          onClose={this.closeAdditionalMenu}
          menuItems={this.additionalMenuItems()}
        />
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
