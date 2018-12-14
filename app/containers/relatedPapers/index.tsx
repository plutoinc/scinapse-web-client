import * as React from "react";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import { withStyles } from "../../helpers/withStylesHelper";
import PaperShowRelatedPaperItem from "../../components/paperShow/components/relatedPaperItem";
import { Paper, paperSchema } from "../../model/paper";
import { AppState } from "../../reducers";
const styles = require("./relatedPaperList.scss");

const MAX_RELATED_PAPER_ITEM_COUNT = 3;

interface RelatedPaperListProps {
  paperList: Paper[];
}

@withStyles<typeof RelatedPaperList>(styles)
class RelatedPaperList extends React.PureComponent<RelatedPaperListProps> {
  public render() {
    const { paperList } = this.props;

    if (!paperList || paperList.length === 0) {
      return null;
    }

    const papers = paperList.slice(0, MAX_RELATED_PAPER_ITEM_COUNT).map(paper => {
      if (paper) {
        return <PaperShowRelatedPaperItem refererSection="related_papers" key={paper.id} paper={paper} />;
      }
    });

    return (
      <div className={styles.relatedPapers}>
        <div className={styles.sideNavigationBlockHeader}>Related Papers</div>
        {papers}
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    paperList: denormalize(state.paperShow.relatedPaperIds, [paperSchema], state.entities),
  };
}

export default connect(mapStateToProps)(RelatedPaperList);
