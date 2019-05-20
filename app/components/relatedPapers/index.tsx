import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import { Paper } from "../../model/paper";
import PaperItem from "../common/paperItem";
import { AUTH_LEVEL, blockUnverifiedUser } from "../../helpers/checkAuthDialog";
import ArticleSpinner from "../common/spinner/articleSpinner";
const styles = require("./relatedPapers.scss");

interface RelatedPapersProps {
  paperList: Paper[];
  isLoggedIn: boolean;
  isLoading: boolean;
  shouldShowRelatedPapers: boolean;
}

function openSignInDialog() {
  blockUnverifiedUser({
    authLevel: AUTH_LEVEL.VERIFIED,
    actionArea: "paperShow",
    actionLabel: "relatedPaperAtPaperShow",
    userActionType: "relatedPaperAtPaperShow",
  });
}

const ContentBlocker: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className={styles.contentBlockedContainer}>
      <div className={styles.contentBlockedContext}>
        {`78% of Scinapse members use related papers.\nAfter signing in, all features are free.`}
      </div>
      <button className={styles.signInBtn} onClick={openSignInDialog}>
        Sign in & View
      </button>
    </div>
  );
};

const RelatedPaperItem: React.FunctionComponent<{ paper: Paper }> = ({ paper }) => {
  return (
    <PaperItem
      key={paper.id}
      paper={paper}
      omitAbstract={true}
      pageType="paperShow"
      actionArea="relatedPaperList"
      wrapperClassName={styles.paperItemWrapper}
    />
  );
};

const RelatedPapersInPaperShow: React.FC<RelatedPapersProps> = props => {
  const { paperList, isLoggedIn, isLoading, shouldShowRelatedPapers } = props;

  if (paperList.length === 0 || !shouldShowRelatedPapers) {
    return null;
  }

  const relatedPaperItems = paperList.map((paper, index) => {
    if (index < 3) {
      return (
        <div key={paper.id}>
          <RelatedPaperItem paper={paper} />
        </div>
      );
    }
  });

  return (
    <div className={styles.relatedPaperContainer}>
      <div className={styles.titleContext}>📖 Papers frequently viewed together</div>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      ) : (
        <>
          <div className={!isLoggedIn ? styles.relatedPaperWrapper : undefined}>{relatedPaperItems}</div>
          <ContentBlocker isLoggedIn={isLoggedIn} />
        </>
      )}
    </div>
  );
};

export default withStyles<typeof styles>(styles)(RelatedPapersInPaperShow);
