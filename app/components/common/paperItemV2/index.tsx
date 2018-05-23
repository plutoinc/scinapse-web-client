import * as React from "react";
import { Link } from "react-router-dom";
import { stringify } from "qs";
import Icon from "../../../icons";
import { Paper } from "../../../model/paper";
import { withStyles } from "../../../helpers/withStylesHelper";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { PaperShowPageQueryParams } from "../../paperShow";
const styles = require("./paperItemV2.scss");

const MAX_LENGTH_OF_ABSTRACT = 500;

export interface PaperItemV2Props {
  paper: Paper;
}

class PaperItemV2 extends React.PureComponent<PaperItemV2Props, {}> {
  public render() {
    const { paper } = this.props;
    const queryParams: PaperShowPageQueryParams = { "ref-page": 1, "cited-page": 1 };
    const stringifiedQueryParams = stringify(queryParams, { addQueryPrefix: true });

    return (
      <div className={styles.itemWrapper}>
        <Link
          to={{
            pathname: `/papers/${paper.id}`,
            search: stringifiedQueryParams,
          }}
          className={styles.title}
        >
          {paper.title}
        </Link>
        <div className={styles.journalAndDOISection}>
          {this.getAuthorsNode()}
          {this.getJournalInformationNode()}
        </div>
        <div className={styles.abstract}>{this.getAbstractText()}</div>
        <div className={styles.actionButtonWrapper}>
          {this.getRefButton()}
          {this.getCitedButton()}
          {this.getPDFDownloadButton()}
          {this.getViewInSourceButton()}
        </div>
      </div>
    );
  }

  private getRefButton = () => {
    const { paper } = this.props;

    if (paper.referenceCount > 0) {
      return (
        <Link
          to={{
            pathname: `/papers/${paper.id}`,
            hash: "references",
          }}
          className={styles.firstButton}
        >
          <Icon className={styles.referenceIconWrapper} icon="REFERENCE" />
          {`Ref ${paper.referenceCount}`}
        </Link>
      );
    } else {
      return null;
    }
  };

  private getCitedButton = () => {
    const { paper } = this.props;

    if (paper.citedCount > 0) {
      return (
        <Link
          to={{
            pathname: `/papers/${paper.id}`,
            hash: "cited",
          }}
          className={styles.actionButton}
        >
          <Icon className={styles.citedIconWrapper} icon="CITED" />
          {`Cited ${paper.citedCount}`}
        </Link>
      );
    } else {
      return null;
    }
  };

  private getViewInSourceButton = () => {
    const { paper } = this.props;

    const source = paper.doi ? `https://dx.doi.org/${paper.doi}` : paper.urls[0].url;

    if (paper) {
      return (
        <a target="_blank" href={source} className={styles.actionButton}>
          <Icon className={styles.sourceIcon} icon="EXTERNAL_SOURCE" />
          View in source
        </a>
      );
    } else {
      return null;
    }
  };

  private getPDFDownloadButton = () => {
    const { paper } = this.props;

    const pdfSourceRecord = paper.urls.find(paperSource => {
      return paperSource.url.includes(".pdf");
    });

    if (pdfSourceRecord) {
      return (
        <a href={pdfSourceRecord.url} className={`${styles.pdfButtonWrapper} ${styles.actionButton}`} target="_blank">
          <Icon className={styles.pdfIconWrapper} icon="DOWNLOAD" />
          <span>PDF</span>
        </a>
      );
    } else {
      return null;
    }
  };

  private getAbstractText = () => {
    const { paper } = this.props;

    if (!paper.abstract) {
      return null;
    }

    const cleanAbstract = paper.abstract
      .replace(/^ /gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/#[A-Z0-9]+#/g, "");

    let finalAbstract = cleanAbstract;
    if (cleanAbstract.length > MAX_LENGTH_OF_ABSTRACT) {
      finalAbstract = cleanAbstract.slice(0, MAX_LENGTH_OF_ABSTRACT) + "...";
    }

    return finalAbstract;
  };

  private getAuthorsNode = () => {
    const { paper } = this.props;

    if (!paper.authors || paper.authors.length === 0) {
      return null;
    } else {
      const authorNodes = paper.authors.map((author, index) => {
        let affiliationLink = null;
        if (author.affiliation && author.affiliation.name) {
          const targetSearchQueryParams = papersQueryFormatter.stringifyPapersQuery({
            query: author.affiliation.name,
            sort: "RELEVANCE",
            filter: {},
            page: 1,
          });
          affiliationLink = (
            <Link
              className={styles.authorAffiliationLink}
              to={{
                pathname: "/search",
                search: targetSearchQueryParams,
              }}
            >
              {` (${author.affiliation.name})`}
            </Link>
          );
        }

        return (
          <span className={styles.authorLinkBox} key={`paper_authors_${author.id}_${index}`}>
            <Link className={styles.authorLink} to={`/authors/${author.id}`}>
              {author.name}
            </Link>
            {affiliationLink}
            <span>{index === paper.authors.length - 1 ? "" : `, `}</span>
          </span>
        );
      });

      return (
        <div className={styles.authorBox}>
          <span className={styles.authorSubtitle}>{`AUTHORS | `}</span>
          {authorNodes}
        </div>
      );
    }
  };

  private getJournalInformationNode = () => {
    const { paper } = this.props;

    if (!paper.journal) {
      return null;
    } else {
      return (
        <div className={styles.journalInformation}>
          <span className={styles.informationSubtitle}>PUBLISHED</span>
          <span>{` | ${paper.year} in `}</span>
          <a
            className={styles.journalLink}
            href={`/search?${papersQueryFormatter.stringifyPapersQuery({
              query: paper.journal.fullTitle || paper.venue,
              page: 1,
              filter: {},
              sort: "RELEVANCE",
            })}`}
            target="_blank"
          >
            {`${paper.journal.fullTitle || paper.venue}`}
          </a>
          <span>{paper.journal.impactFactor ? ` [IF: ${paper.journal.impactFactor.toFixed(2)}]` : ""}</span>
        </div>
      );
    }
  };
}

export default withStyles<typeof PaperItemV2>(styles)(PaperItemV2);
