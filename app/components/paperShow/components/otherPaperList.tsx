import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import PaperShowRelatedPaperItem from './relatedPaperItem';
import { Paper } from '../../../model/paper';
const styles = require('./otherPaperList.scss');

const MAX_OTHER_PAPER_ITEM_COUNT = 5;

interface PaperShowOtherPaperListProps {
  paperList: Paper[];
}

class PaperShowOtherPaperList extends React.PureComponent<PaperShowOtherPaperListProps, {}> {
  public render() {
    const { paperList } = this.props;

    if (!paperList || paperList.length === 0) {
      return null;
    }

    const papers = paperList.slice(0, MAX_OTHER_PAPER_ITEM_COUNT).map(paper => {
      if (paper) {
        return (
          <PaperShowRelatedPaperItem actionArea="otherPaperList" key={`other_paper_item_${paper.id}`} paper={paper} />
        );
      }
    });

    return (
      <div className={styles.paperListWrapper}>
        <div className={styles.title}>OTHER PAPERS BY FIRST AUTHOR</div>
        {papers}
      </div>
    );
  }
}

export default withStyles<typeof PaperShowOtherPaperList>(styles)(PaperShowOtherPaperList);
