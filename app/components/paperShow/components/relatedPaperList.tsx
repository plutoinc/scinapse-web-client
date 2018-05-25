import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import PaperShowRelatedPaperItem from "./relatedPaperItem";
import { PaperList } from "../../../model/paper";
const styles = require("./relatedPaperList.scss");

const MAX_RELATED_PAPER_ITEM_COUNT = 3;

interface PaperShowRelatedPaperListProps {
  paperList: PaperList;
}

class PaperShowRelatedPaperList extends React.PureComponent<PaperShowRelatedPaperListProps, {}> {
  public render() {
    const { paperList } = this.props;

    if (!paperList || paperList.isEmpty()) {
      return null;
    }

    const papers = paperList.slice(0, MAX_RELATED_PAPER_ITEM_COUNT).map(paper => {
      if (paper) {
        return <PaperShowRelatedPaperItem key={`related_paper_item_${paper.id}`} paper={paper} />;
      }
    });

    return (
      <div className={styles.paperListWrapper}>
        <div className={styles.title}>RELATED PAPERS</div>
        {papers}
      </div>
    );
  }
}

export default withStyles<typeof PaperShowRelatedPaperList>(styles)(PaperShowRelatedPaperList);
