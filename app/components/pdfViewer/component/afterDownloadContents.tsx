import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import SearchQueryInput from "../../common/InputWithSuggestionList/searchQueryInput";
import Icon from "../../../icons";
import RelatedPapers from "../../relatedPapers";
import { Paper } from "../../../model/paper";
const styles = require("./afterDownloadContents.scss");

interface AfterDownloadContentsProps {
  relatedPaperTestUserName: string;
  handleDownloadPdf: (isDownload: boolean) => void;
  relatedPaperList: Paper[];
  isLoggedIn: boolean;
  isRelatedPaperLoading: boolean;
}

const SearchQueryBoxAtPaperShow: React.FC<{ shouldShowSearchBox: boolean }> = ({ shouldShowSearchBox }) => {
  if (!shouldShowSearchBox) return null;

  return (
    <div className={styles.afterDownloadSearchContainer}>
      <div className={styles.titleContext}>🔍 You can get more papers by searching!</div>
      <div tabIndex={0} className={styles.searchInputForm}>
        <SearchQueryInput maxCount={5} actionArea="paperShow" inputClassName={styles.searchInput} />
      </div>
    </div>
  );
};

const AfterDownloadContents: React.FC<AfterDownloadContentsProps> = props => {
  const { relatedPaperTestUserName, handleDownloadPdf, relatedPaperList, isLoggedIn, isRelatedPaperLoading } = props;

  let shouldShow = {
    shouldShowRelatedPapers: false,
    shouldShowSearchBox: false,
  };

  switch (relatedPaperTestUserName) {
    case "related":
      shouldShow = { shouldShowRelatedPapers: true, shouldShowSearchBox: false };
      break;
    case "relatedAndSearch":
      shouldShow = { shouldShowRelatedPapers: true, shouldShowSearchBox: true };
      break;
    case "search":
      shouldShow = { shouldShowRelatedPapers: false, shouldShowSearchBox: true };
      break;
  }

  return (
    <>
      <div className={styles.afterDownloadContainer}>
        <div className={styles.titleContext}>Thanks for downloading</div>
        <div className={styles.subContext}>
          “Where Is Current Research on Blockchain Technology?-A Systematic Review.”
        </div>
        <button className={styles.reloadBtn} onClick={() => handleDownloadPdf(false)}>
          <Icon icon="RELOAD" className={styles.reloadIcon} />
          Reload Full-Text
        </button>
      </div>
      <SearchQueryBoxAtPaperShow shouldShowSearchBox={shouldShow.shouldShowSearchBox} />
      <RelatedPapers
        paperList={relatedPaperList}
        isLoggedIn={isLoggedIn}
        isLoading={isRelatedPaperLoading}
        shouldShowRelatedPapers={shouldShow.shouldShowRelatedPapers}
      />
    </>
  );
};

export default withStyles<typeof styles>(styles)(AfterDownloadContents);
