import * as React from "react";
import { ArticleSearchStateRecord } from "../../records";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./noResult.scss");

export enum NoResultType {
  "FROM_SEARCH_QUERY",
  "FROM_REF",
  "FROM_CITE",
}

interface NoResultProps {
  type: NoResultType;
  searchText?: string;
  articleSearchState: ArticleSearchStateRecord;
}

function getNoResultFromContent(props: NoResultProps) {
  switch (props.type) {
    case NoResultType.FROM_SEARCH_QUERY: {
      return `[${props.searchText}]`;
    }

    case NoResultType.FROM_REF: {
      if (props.articleSearchState.targetPaper) {
        return `References of article [${props.articleSearchState.targetPaper.title}]`;
      } else {
        return "References of article";
      }
    }

    case NoResultType.FROM_CITE: {
      if (props.articleSearchState.targetPaper) {
        return `Cited of article [${props.articleSearchState.targetPaper.title}]`;
      } else {
        return "Cited of article";
      }
    }

    default: {
      return null;
    }
  }
}

const NoResult = (props: NoResultProps) => {
  return (
    <div className={styles.articleSearchContainer}>
      <div className={styles.noPapersContainer}>
        <div className={styles.noPapersTitle}>Sorry :(</div>
        <div className={styles.noPapersContent}>
          <b>sci-napse</b> can't find any result for{" "}
          <span className={styles.keyword}>{getNoResultFromContent(props)}.</span>
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof NoResult>(styles)(NoResult);
