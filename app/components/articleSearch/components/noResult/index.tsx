import * as React from "react";
import { ArticleSearchState } from "../../records";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./noResult.scss");

interface NoResultProps {
  searchText?: string;
  articleSearchState: ArticleSearchState;
}

const NoResult = (props: NoResultProps) => {
  return (
    <div className={styles.articleSearchContainer}>
      <div className={styles.noPapersContainer}>
        <div className={styles.noPapersTitle}>Sorry :(</div>
        <div className={styles.noPapersContent}>
          <b>Sci-napse</b> can't find any result for <span className={styles.keyword}>{props.searchText}.</span>
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof NoResult>(styles)(NoResult);
