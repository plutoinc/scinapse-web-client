import * as React from "react";
import { ArticleSearchState } from "../../records";
import { withStyles } from "../../../../helpers/withStylesHelper";
import Icon from "../../../../icons";
import FilterResetButton from "../../../filterContainer/filterResetButton";
const styles = require("./noResult.scss");

interface NoResultProps {
  searchText?: string;
  articleSearchState: ArticleSearchState;
  hasFilterEmpty: boolean;
}

const NoResult = (props: NoResultProps) => {
  return (
    <div className={styles.articleSearchContainer}>
      <div className={styles.noPapersContainer}>
        <div className={styles.iconWrapper}>
          <Icon icon="NO_PAPER_RESULT" />
        </div>
        <div className={styles.noPapersContentWrapper}>
          <div className={styles.noPapersTitle}>Sorry</div>
          <div className={styles.noPapersContent}>
            <b>Scinapse</b> found no result for <span className={styles.keyword}>"{props.searchText}".</span>
            <span className={styles.noPapersText}>Please check if all words are spelled correctly.</span>
            <span className={styles.noPapersText}>Please check the spacing between keywords.</span>
            <span className={styles.noPapersText}>Try reducing the number of keywords or using more common terms.</span>
            {!props.hasFilterEmpty ? (
              <span className={styles.noPapersText}>
                Try disabling the filter.
                <FilterResetButton
                  text="Reset All"
                  btnStyle={{ position: "relative", top: 0, fontSize: "15px", marginLeft: "4px" }}
                />
              </span>
            ) : null}
            <span className={styles.noPapersText}>
              Scinapse may not include the paper you're looking for. We will comply ASAP to requests!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof NoResult>(styles)(NoResult);
