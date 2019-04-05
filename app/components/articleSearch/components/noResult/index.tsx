import * as React from "react";
import { ArticleSearchState } from "../../records";
import { withStyles } from "../../../../helpers/withStylesHelper";
import Icon from "../../../../icons";
import FilterResetButton from "../../../filterContainer/filterResetButton";
import RequestPaperDialog from "../requestPaperDialog";
import ArticleSpinner from "../../../common/spinner/articleSpinner";
const styles = require("./noResult.scss");

interface NoResultProps {
  searchText: string;
  isLoading: boolean;
  articleSearchState: ArticleSearchState;
  hasFilterEmpty: boolean;
}

const NoResult: React.FunctionComponent<NoResultProps> = props => {
  const { hasFilterEmpty, articleSearchState, isLoading } = props;
  const { doiPatternMatched, doi, searchInput } = articleSearchState;
  const [isOpen, setIsOpen] = React.useState(false);
  const query = props.articleSearchState.doiPatternMatched
    ? props.articleSearchState.doi
    : props.articleSearchState.searchInput;

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  }

  function getNoResultNotiContent() {
    const disabledFilterMessage = !hasFilterEmpty ? (
      <li>
        <span className={styles.noPapersText}>
          Try <b>disabling</b> the filter.
          <FilterResetButton
            text="Reset All"
            btnStyle={{
              position: "relative",
              top: 0,
              fontSize: "15px",
              marginLeft: "4px",
              fontWeight: 500,
              color: "#3e7fff",
            }}
          />
        </span>
      </li>
    ) : null;

    if (doiPatternMatched && !!doi) {
      return (
        <>
          <b>Scinapse</b> found no result for <b className={styles.keyword}>"{searchInput}".</b>
          <ul className={styles.contextWrapper}>
            {disabledFilterMessage}
            <li>
              <span className={styles.noPapersText}>
                Please <b>double-check</b> the DOI is correct.
              </span>
            </li>
            <li>
              <span className={styles.noPapersText}>
                Scinapse may not include the paper. Try visiting{" "}
                <a className={styles.doiLink} target="_blank" rel="noopener" href={`https://doi.org/${doi}`}>
                  the original
                </a>{" "}
                or{" "}
                <b
                  className={styles.paperRequestLink}
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  Request
                </b>{" "}
                inclusion.
              </span>
            </li>
          </ul>
        </>
      );
    } else {
      return (
        <>
          <b>Scinapse</b> found no result for <b className={styles.keyword}>"{searchInput}".</b>
          <ul className={styles.contextWrapper}>
            {disabledFilterMessage}
            <li>
              <span className={styles.noPapersText}>
                Please check if all words are <b>spelled</b> correctly.
              </span>
            </li>
            <li>
              <span className={styles.noPapersText}>
                Please check the <b>spacing</b> between keywords.
              </span>
            </li>
            <li>
              <span className={styles.noPapersText}>
                Try to reduce <b>the number of keywords</b> or use <b>common terms</b>.
              </span>
            </li>
            <li>
              <span className={styles.noPapersText}>
                Sometimes we may not include the paper you're looking for. We will comply when you{" "}
                <b
                  className={styles.paperRequestLink}
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  request.
                </b>
              </span>
            </li>
          </ul>
        </>
      );
    }
  }

  return (
    <div className={styles.articleSearchContainer}>
      <div className={styles.noPapersContainer}>
        <div className={styles.iconWrapper}>
          <Icon icon="NO_PAPER_RESULT" />
        </div>
        <div className={styles.noPapersContentWrapper}>
          <div className={styles.noPapersTitle}>Sorry</div>
          <div className={styles.noPapersContent}>
            {getNoResultNotiContent()}
            <RequestPaperDialog
              isOpen={isOpen}
              query={query}
              onClose={() => {
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof NoResult>(styles)(NoResult);
