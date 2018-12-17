import * as React from "react";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import { withStyles } from "../../helpers/withStylesHelper";
import PaperShowRelatedPaperItem from "../../components/paperShow/components/relatedPaperItem";
import { Paper, paperSchema } from "../../model/paper";
import { AppState } from "../../reducers";
import { createSelector } from "reselect";
import { getPaperEntities } from "../../selectors/papersSelector";
const styles = require("./otherPapersFromAuthor.scss");

const MAX_RELATED_PAPER_ITEM_COUNT = 3;

interface OtherPaperListFromAuthorProps {
  paperList: Paper[];
}

@withStyles<typeof OtherPaperListFromAuthor>(styles)
class OtherPaperListFromAuthor extends React.PureComponent<OtherPaperListFromAuthorProps> {
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
        <div className={styles.sideNavigationBlockHeader}>Other Papers By First Author</div>
        {papers}
      </div>
    );
  }
}

function getPaperIds(state: AppState) {
  return state.paperShow.otherPaperIdsFromAuthor;
}

const getMemoizedRelatedPapers = createSelector([getPaperIds, getPaperEntities], (paperIds, paperEntities) => {
  return denormalize(paperIds, [paperSchema], { papers: paperEntities });
});

function mapStateToProps(state: AppState) {
  return {
    paperList: getMemoizedRelatedPapers(state),
  };
}

export default connect(mapStateToProps)(OtherPaperListFromAuthor);
