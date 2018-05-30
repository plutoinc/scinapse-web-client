import * as React from "react";
import { Link } from "react-router-dom";
import { trackAndOpenLink, trackEvent } from "../../../../helpers/handleGA";
import Icon from "../../../../icons";
import { withStyles } from "../../../../helpers/withStylesHelper";
import DOIButton from "./doiButton";
import { CurrentUser } from "../../../../model/currentUser";
import { Paper } from "../../../../model/paper";
import { IPaperSourceRecord } from "../../../../model/paperSource";
const styles = require("./infoList.scss");

export interface InfoListProps {
  paper: Paper;
  currentUser: CurrentUser;
  isBookmarked: boolean;
  toggleCitationDialog: () => void;
  handleRemoveBookmark: (paper: Paper) => void;
  handlePostBookmark: (paper: Paper) => void;
  setActiveCitationDialog?: (paperId: number) => void;
}

class InfoList extends React.PureComponent<InfoListProps, {}> {
  public render() {
    const { paper } = this.props;
    const { referenceCount, citedCount } = paper;

    const pdfSourceRecord =
      paper.urls &&
      paper.urls.find((paperSource: IPaperSourceRecord) => {
        return paperSource.url.includes(".pdf");
      });

    let pdfSourceUrl;
    if (!!pdfSourceRecord) {
      pdfSourceUrl = pdfSourceRecord.url;
    }

    let source: string;
    if (!!paper.doi) {
      source = `https://dx.doi.org/${paper.doi}`;
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
        <a
          href={pdfSourceUrl}
          target="_blank"
          onClick={() => {
            trackAndOpenLink("searchItemPdfButton");
          }}
          style={!pdfSourceUrl ? { display: "none" } : {}}
          className={styles.pdfButton}
        >
          <Icon className={styles.pdfIconWrapper} icon="PDF_ICON" />
          <span>PDF</span>
        </a>
        <a
          onClick={() => {
            trackAndOpenLink("search-item-source-button");
          }}
          className={styles.sourceButton}
          target="_blank"
          href={source}
        >
          <Icon className={styles.sourceButtonIcon} icon="SOURCE_LINK" />
          <span>Source</span>
        </a>
        <div className={styles.rightBox}>
          <DOIButton
            DOI={paper.doi}
            trackEventParams={{ category: "search-item", action: "copy-DOI", label: paper.id.toString() }}
          />
          <span style={{ display: paper.doi ? "inline-block" : "none" }} className={styles.verticalDivider} />
          {this.getBookmarkButton()}
          {this.getCitationQuoteButton()}
        </div>
      </div>
    );
  }

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
            trackEvent({ category: "search-item", action: "click-reference", label: `${this.props.paper.id}` });
          }}
          className={styles.referenceButton}
        >
          <Icon className={styles.referenceIconWrapper} icon="REFERENCE" />
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
            trackEvent({ category: "search-item", action: "click-cited", label: `${this.props.paper.id}` });
          }}
          className={styles.citedButton}
        >
          <Icon className={styles.citedIconWrapper} icon="CITED" />
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
                label: `${this.props.paper.id}`,
              });
            }}
          >
            <Icon className={styles.citationIcon} icon="CITATION_QUOTE" />
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
            trackEvent({ category: "search-item", action: "remove-bookmark", label: `${this.props.paper.id}` });
          }}
          className={styles.bookmarkButton}
        >
          <Icon style={{ color: "#666d7c" }} className={styles.bookmarkButtonIcon} icon="BOOKMARK_GRAY" />
        </div>
      );
    } else {
      return (
        <div
          onClick={() => {
            this.props.handlePostBookmark(this.props.paper);
            trackEvent({ category: "search-item", action: "active-bookmark", label: `${this.props.paper.id}` });
          }}
          className={styles.bookmarkButton}
        >
          <Icon className={styles.bookmarkButtonIcon} icon="BOOKMARK_EMPTY" />
        </div>
      );
    }
  };
}

export default withStyles<typeof InfoList>(styles)(InfoList);
