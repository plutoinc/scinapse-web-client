import * as React from "react";
import { Link } from "react-router-dom";
import { trackAndOpenLink, trackEvent } from "../../../../helpers/handleGA";
import Icon from "../../../../icons";
import { withStyles } from "../../../../helpers/withStylesHelper";
import DOIButton from "./doiButton";
import { CurrentUserRecord } from "../../../../model/currentUser";
import { PaperRecord } from "../../../../model/paper";
import { IPaperSourceRecord } from "../../../../model/paperSource";
const styles = require("./infoList.scss");

export interface InfoListProps {
  paper: PaperRecord;
  currentUser: CurrentUserRecord;
  isBookmarked: boolean;
  toggleCitationDialog: () => void;
  setActiveCitationDialog: (paperId: number) => void | undefined;
  handleRemoveBookmark: (paper: PaperRecord) => void;
  handlePostBookmark: (paper: PaperRecord) => void;
}

function getRefButton(props: InfoListProps) {
  if (!props.paper.referenceCount) {
    return null;
  } else {
    return (
      <Link
        to={{
          pathname: `/papers/${props.paper.id}`,
          hash: "references",
        }}
        onClick={() => {
          trackEvent({ category: "search-item", action: "click-reference", label: `${props.paper.id}` });
        }}
        className={styles.referenceButton}
      >
        <Icon className={styles.referenceIconWrapper} icon="REFERENCE" />
        <span>{`Ref ${props.paper.referenceCount}`}</span>
      </Link>
    );
  }
}

function getCitedButton(props: InfoListProps) {
  if (!props.paper.citedCount) {
    return null;
  } else {
    return (
      <Link
        to={{
          pathname: `/papers/${props.paper.id}`,
          hash: "cited",
        }}
        onClick={() => {
          trackEvent({ category: "search-item", action: "click-cited", label: `${props.paper.id}` });
        }}
        className={styles.citedButton}
      >
        <Icon className={styles.citedIconWrapper} icon="CITED" />
        <span>{`Cited ${props.paper.citedCount}`}</span>
      </Link>
    );
  }
}

function getCitationQuoteButton(props: InfoListProps) {
  if (props.paper.doi && props.setActiveCitationDialog) {
    return (
      <span className={styles.DOIMetaButtonsWrapper}>
        <span
          className={styles.citationIconWrapper}
          onClick={() => {
            props.setActiveCitationDialog(props.paper.id);
            props.toggleCitationDialog();
            trackEvent({ category: "search-item", action: "click-citation-quote-button", label: `${props.paper.id}` });
          }}
        >
          <Icon className={styles.citationIcon} icon="CITATION_QUOTE" />
        </span>
      </span>
    );
  } else {
    return null;
  }
}

function getBookmarkButton(props: InfoListProps) {
  if (props.isBookmarked) {
    return (
      <div
        onClick={() => {
          props.handleRemoveBookmark(props.paper);
          trackEvent({ category: "search-item", action: "remove-bookmark", label: `${props.paper.id}` });
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
          props.handlePostBookmark(props.paper);
          trackEvent({ category: "search-item", action: "active-bookmark", label: `${props.paper.id}` });
        }}
        className={styles.bookmarkButton}
      >
        <Icon className={styles.bookmarkButtonIcon} icon="BOOKMARK_EMPTY" />
      </div>
    );
  }
}

class InfoList extends React.Component<InfoListProps, {}> {
  public shouldComponentUpdate(nextProps: InfoListProps) {
    if (
      this.props.paper !== nextProps.paper ||
      this.props.currentUser !== nextProps.currentUser ||
      this.props.isBookmarked !== nextProps.isBookmarked
    ) {
      return true;
    } else {
      return false;
    }
  }

  public render() {
    const { paper } = this.props;
    const { referenceCount, citedCount } = paper;

    const pdfSourceRecord = paper.urls.find((paperSource: IPaperSourceRecord) => {
      return paperSource.url.includes(".pdf");
    });

    let pdfSourceUrl;
    if (!!pdfSourceRecord) {
      pdfSourceUrl = pdfSourceRecord.url;
    }

    let source;
    if (!!paper.doi) {
      source = `https://dx.doi.org/${paper.doi}`;
    } else if (paper.urls.size > 0) {
      source = paper.urls.getIn([0, "url"]);
    }

    const shouldBeEmptyInfoList = !referenceCount && !citedCount && !paper.doi && !pdfSourceUrl && !source;

    if (shouldBeEmptyInfoList) {
      return <div style={{ height: 16 }} />;
    }

    return (
      <div className={styles.infoList}>
        {getRefButton(this.props)}
        {getCitedButton(this.props)}
        <a
          href={pdfSourceUrl}
          target="_blank"
          onClick={() => {
            trackAndOpenLink("searchItemPdfButton");
          }}
          style={!pdfSourceUrl ? { display: "none" } : null}
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
          {getBookmarkButton(this.props)}
          {getCitationQuoteButton(this.props)}
        </div>
      </div>
    );
  }
}

export default withStyles<typeof InfoList>(styles)(InfoList);
