import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import PaperShowRelatedPaperItem from "./relatedPaperItem";
import { PaperList } from "../../../model/paper";
const styles = require("./relatedPaperList.scss");

const MAX_OTHER_PAPER_ITEM_COUNT = 5;

interface PaperShowOtherPaperListProps {
  paperList: PaperList;
}

class PaperShowOtherPaperList extends React.PureComponent<PaperShowOtherPaperListProps, {}> {
  public render() {
    const { paperList } = this.props;

    if (!paperList || paperList.isEmpty()) {
      return null;
    }

    const papers = paperList.slice(0, MAX_OTHER_PAPER_ITEM_COUNT).map(paper => {
      return <PaperShowRelatedPaperItem key={`other_paper_item_${paper.id}`} paper={paper} />;
    });

    return (
      <div className={styles.paperListWrapper}>
        <div className={styles.title}>OTHER PAPERS BY THIS AUTHOR</div>
        {papers}
      </div>
    );
  }
}

export default withStyles<typeof PaperShowOtherPaperList>(styles)(PaperShowOtherPaperList);
