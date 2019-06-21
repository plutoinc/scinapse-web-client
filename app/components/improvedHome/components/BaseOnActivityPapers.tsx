import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import { Paper } from '../../../model/paper';
import SkeletonPaperItem from '../../common/skeletonPaperItem/skeletonPaperItem';
import PaperItem from '../../common/paperItem';
const styles = require('./recommendedPapers.scss');

const BaseOnActivityPapers: React.FC<{ isLoading: boolean; papers: Paper[] }> = ({ isLoading, papers }) => {
  const [isPaperExpanding, setIsPaperExpanding] = React.useState(false);

  if (!papers) return null;

  if (isLoading)
    return (
      <>
        <SkeletonPaperItem />
        <SkeletonPaperItem />
        <SkeletonPaperItem />
        <SkeletonPaperItem />
        <SkeletonPaperItem />
      </>
    );

  const targetPapers = isPaperExpanding ? papers : papers.slice(0, 5);

  const moreButton =
    papers.length <= 5 ? null : (
      <div
        onClick={() => {
          setIsPaperExpanding(!isPaperExpanding);
        }}
        className={styles.moreItem}
      >
        {isPaperExpanding ? 'See less' : 'See More'}
        <Icon
          icon="ARROW_POINT_TO_DOWN"
          className={classNames({
            [styles.downIcon]: !isPaperExpanding,
            [styles.upIcon]: isPaperExpanding,
          })}
        />
      </div>
    );

  const activityPapers = targetPapers.map(paper => (
    <PaperItem
      key={paper.id}
      paper={paper}
      omitAbstract={true}
      pageType="collectionShow"
      actionArea="relatedPaperList"
      wrapperClassName={styles.paperItemWrapper}
    />
  ));

  return (
    <>
      {activityPapers}
      {moreButton}
    </>
  );
};

export default withStyles<typeof BaseOnActivityPapers>(styles)(BaseOnActivityPapers);
