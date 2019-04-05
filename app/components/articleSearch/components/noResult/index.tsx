import * as React from "react";
import { ArticleSearchState } from "../../records";
import { withStyles } from "../../../../helpers/withStylesHelper";
import Icon from "../../../../icons";
import FilterResetButton from "../../../filterContainer/filterResetButton";
import RequestPaperDialog from "../requestPaperDialog";
const styles = require("./noResult.scss");

interface NoResultProps {
  searchText: string;
  articleSearchState: ArticleSearchState;
  hasFilterEmpty: boolean;
}

function getNoResultNotiContent(
  hasFilterEmpty: boolean,
  isDoiPattern: boolean,
  searchInput: string,
  doi: string | null
) {
  const disabledFilterMessage = !hasFilterEmpty ? (
    <span className={styles.noPapersText}>
      Try disabling the filter.
      <FilterResetButton
        text="Reset All"
        btnStyle={{ position: "relative", top: 0, fontSize: "15px", marginLeft: "4px" }}
      />
    </span>
  ) : null;

  if (isDoiPattern && !!doi) {
    return (
      <>
        <b>Scinapse</b> found no result for <span className={styles.keyword}>"{searchInput}".</span>
        {disabledFilterMessage}
        <span className={styles.noPapersText}>Please double-check the DOI is correct.</span>
        <span className={styles.noPapersText}>
          Scinapse may not include the paper. Try visiting{" "}
          <a className={styles.doiLink} target="_blank" rel="noopener" href={`https://doi.org/${doi}`}>
            the original
          </a>{" "}
          or Request inclusion.
        </span>
      </>
    );
  } else {
    return (
      <>
        <b>Scinapse</b> found no result for <span className={styles.keyword}>"{searchInput}".</span>
        {disabledFilterMessage}
        <span className={styles.noPapersText}>Please check if all words are spelled correctly.</span>
        <span className={styles.noPapersText}>Please check the spacing between keywords.</span>
        <span className={styles.noPapersText}>Try reducing the number of keywords or using more common terms.</span>
        <span className={styles.noPapersText}>
          Scinapse may not include the paper you're looking for. We will comply ASAP to requests!
        </span>
      </>
    );
  }
}

const NoResult: React.FunctionComponent<NoResultProps> = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const query = props.articleSearchState.doiPatternMatched
    ? props.articleSearchState.doi
    : props.articleSearchState.searchInput;

  return (
    <div className={styles.articleSearchContainer}>
      <div className={styles.noPapersContainer}>
        <div className={styles.iconWrapper}>
          <Icon icon="NO_PAPER_RESULT" />
        </div>
        <div className={styles.noPapersContentWrapper}>
          <div className={styles.noPapersTitle}>Sorry</div>
          <div className={styles.noPapersContent}>
            {getNoResultNotiContent(
              props.hasFilterEmpty,
              props.articleSearchState.doiPatternMatched,
              props.searchText,
              props.articleSearchState.doi
            )}
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
              }}
              className={styles.paperRequestBtn}
            >
              Request Paper
            </button>
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
