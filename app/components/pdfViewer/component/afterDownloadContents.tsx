import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import SearchQueryInput from "../../common/InputWithSuggestionList/searchQueryInput";
import Icon from "../../../icons";
import RelatedPapers from "../../relatedPapers";
import { Paper } from "../../../model/paper";
import { getUserGroupName } from "../../../helpers/abTestHelper";
import { RELATED_PAPERS_AT_PAPER_SHOW_TEST } from "../../../constants/abTestGlobalValue";
const styles = require("./afterDownloadContents.scss");

interface AfterDownloadContentsProps {
  onDownloadedPDF: (isDownload: boolean) => void;
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
  const { onDownloadedPDF, relatedPaperList, isLoggedIn, isRelatedPaperLoading } = props;
  const relatedPapersTestUserGroupName = getUserGroupName(RELATED_PAPERS_AT_PAPER_SHOW_TEST) || "";

  const [isShowingRelatedPapers, setIsShowingRelatedPapers] = React.useState(false);
  const [isShowingSearchBox, setIsShowingSearchBox] = React.useState(false);

  React.useEffect(
    () => {
      switch (relatedPapersTestUserGroupName) {
        case "related":
          setIsShowingRelatedPapers(true);
          setIsShowingSearchBox(false);
          break;
        case "relatedAndSearch":
          setIsShowingRelatedPapers(true);
          setIsShowingSearchBox(true);
          break;
        case "search":
          setIsShowingRelatedPapers(false);
          setIsShowingSearchBox(true);
          break;
      }
    },
    [relatedPapersTestUserGroupName]
  );

  return (
    <>
      <div className={styles.afterDownloadContainer}>
        <div className={styles.titleContext}>Thanks for downloading</div>
        <div className={styles.subContext}>
          “Where Is Current Research on Blockchain Technology?-A Systematic Review.”
        </div>
        <button className={styles.reloadBtn} onClick={() => onDownloadedPDF(false)}>
          <Icon icon="RELOAD" className={styles.reloadIcon} />
          Reload Full-Text
        </button>
      </div>
      <SearchQueryBoxAtPaperShow shouldShowSearchBox={isShowingSearchBox} />
      <RelatedPapers
        paperList={relatedPaperList}
        isLoggedIn={isLoggedIn}
        isLoading={isRelatedPaperLoading}
        shouldShowRelatedPapers={isShowingRelatedPapers}
      />
    </>
  );
};

export default withStyles<typeof styles>(styles)(AfterDownloadContents);
