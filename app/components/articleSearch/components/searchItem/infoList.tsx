import * as React from "react";
import { Link } from "react-router-dom";
import { trackAndOpenLink, trackEvent } from "../../../../helpers/handleGA";
import Icon from "../../../../icons";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { CurrentUser } from "../../../../model/currentUser";
import { Paper } from "../../../../model/paper";
import { IPaperSource } from "../../../../model/paperSource";
const styles = require("./infoList.scss");
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import EnvChecker from "../../../../helpers/envChecker";

interface HandleClickClaim {
  paperId: number;
}

export interface InfoListProps {
  paper: Paper;
  currentUser: CurrentUser;
  isBookmarked: boolean;
  toggleAddCollectionDialog: (paperId: number) => void;
  toggleCitationDialog: () => void;
  handleRemoveBookmark: (paper: Paper) => void;
  handlePostBookmark: (paper: Paper) => void;
  setActiveCitationDialog?: (paperId: number) => void;
}

export interface InfoListState
  extends Readonly<{
      isAdditionalMenuOpen: boolean;
    }> {}

class InfoList extends React.PureComponent<InfoListProps, InfoListState> {
  private additionalMenuAnchorEl: HTMLElement | null;

  public constructor(props: InfoListProps) {
    super(props);

    this.state = {
      isAdditionalMenuOpen: false
    };
  }

  public render() {
    const { paper } = this.props;
    const { referenceCount, citedCount } = paper;

    const pdfSourceRecord =
      paper.urls &&
      paper.urls.find((paperSource: IPaperSource) => {
        return paperSource.url.includes(".pdf");
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

    const shouldBeEmptyInfoList =
      !referenceCount && !citedCount && !paper.doi && !pdfSourceUrl && !source;

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
        {this.getBookmarkButton()}
        {this.getAddCollectionButton()}
        {this.getMoreButton()}
      </div>
    );
  }

  private getAddCollectionButton = () => {
    // const { paper, toggleAddCollectionDialog } = this.props;

    return null;
    // return (
    //   <span
    //     className={styles.addCollectionBtnWrapper}
    //     onClick={() => {
    //       toggleAddCollectionDialog(paper.id);
    //       trackEvent({
    //         category: "search-item",
    //         action: "click-add-collection-button",
    //         label: `${paper.id}`
    //       });
    //     }}
    //   >
    //     <Icon className={styles.plusIcon} icon="SMALL_PLUS" />
    //     <span>Add Collection</span>
    //   </span>
    // );
  };

  private getRefButton = () => {
    if (!this.props.paper.referenceCount) {
      return null;
    } else {
      return (
        <Link
          to={{
            pathname: `/papers/${this.props.paper.id}`,
            hash: "references"
          }}
          onClick={() => {
            trackEvent({
              category: "search-item",
              action: "click-reference",
              label: `${this.props.paper.id}`
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
            hash: "cited"
          }}
          onClick={() => {
            trackEvent({
              category: "search-item",
              action: "click-cited",
              label: `${this.props.paper.id}`
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
    if (this.props.paper.doi && this.props.setActiveCitationDialog) {
      return (
        <span className={styles.DOIMetaButtonsWrapper}>
          <span
            className={styles.citationIconWrapper}
            onClick={() => {
              this.props.setActiveCitationDialog!(this.props.paper.id);
              this.props.toggleCitationDialog();
              trackEvent({
                category: "search-item",
                action: "click-citation-quote-button",
                label: `${this.props.paper.id}`
              });
            }}
          >
            <Icon className={styles.citationIcon} icon="CITATION_QUOTE" />
            <span>{"Cite this paper"}</span>
          </span>
        </span>
      );
    } else {
      return null;
    }
  };

  private getBookmarkButton = () => {
    if (this.props.isBookmarked) {
      return (
        <div
          onClick={() => {
            this.props.handleRemoveBookmark(this.props.paper);
            trackEvent({
              category: "search-item",
              action: "remove-bookmark",
              label: `${this.props.paper.id}`
            });
          }}
          className={styles.bookmarkButton}
        >
          <Icon className={styles.bookmarkIcon} icon="BOOKMARK_REMOVE" />
          <span>{"Bookmarked"}</span>
        </div>
      );
    } else {
      return (
        <div
          onClick={() => {
            this.props.handlePostBookmark(this.props.paper);
            trackEvent({
              category: "search-item",
              action: "active-bookmark",
              label: `${this.props.paper.id}`
            });
          }}
          className={styles.bookmarkButton}
        >
          <Icon className={styles.bookmarkIcon} icon="BOOKMARK_GRAY" />
          <span>{"Bookmark"}</span>
        </div>
      );
    }
  };

  private getMoreButton = () => {
    return (
      <div className={styles.claimButton}>
        <div ref={el => (this.additionalMenuAnchorEl = el)}>
          <IconButton
            onClick={this.openAdditionalMenu}
            classes={{ root: styles.additionalMenuIcon }}
          >
            <Icon className={styles.ellipsisIcon} icon="ELLIPSIS" />
          </IconButton>
        </div>
        <Popover
          anchorEl={this.additionalMenuAnchorEl!}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={this.state.isAdditionalMenuOpen}
          onClose={this.closeAdditionalMenu}
        >
          <MenuItem
            classes={{ root: styles.additionalMenuItem }}
            onClick={() => {
              this.handleClickClaim({
                paperId: this.props.paper.id
              });
              this.closeAdditionalMenu();
            }}
          >
            Claim
          </MenuItem>
        </Popover>
      </div>
    );
  };

  private openAdditionalMenu = () => {
    this.setState({
      isAdditionalMenuOpen: true
    });
  };

  private closeAdditionalMenu = () => {
    this.setState({
      isAdditionalMenuOpen: false
    });
  };

  private handleClickClaim = ({ paperId }: HandleClickClaim) => {
    const targetId = paperId;

    if (!EnvChecker.isServer()) {
      window.open(
        // tslint:disable-next-line:max-line-length
        `https://docs.google.com/forms/d/e/1FAIpQLScS76iC1pNdq94mMlxSGjcp_BuBM4WqlTpfPDt19LgVJ-t7Ng/viewform?usp=pp_url&entry.130188959=${targetId}&entry.1298741478`,
        "_blank"
      );
    }
  };
}

export default withStyles<typeof InfoList>(styles)(InfoList);
