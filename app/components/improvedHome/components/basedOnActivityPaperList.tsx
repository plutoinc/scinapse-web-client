import React from 'react';
import classNames from 'classnames';
import { range } from 'lodash';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import { Paper } from '../../../model/paper';
import SkeletonPaperItem from '../../common/skeletonPaperItem/skeletonPaperItem';
import PaperItem from '../../common/paperItem';
import { ActionTicketParams } from '../../../helpers/actionTicketManager/actionTicket';
import { useObserver } from '../../../hooks/useIntersectionHook';
import ActionTicketManager from '../../../helpers/actionTicketManager';
const styles = require('./recommendedPapers.scss');
const BASED_ON_ACTIVITY_PAPER_COUNT = 5;

interface BasedOnActivityPaperListProps {
  isLoading: boolean;
  papers: Paper[];
}

const ActivityPaperItem: React.FC<{ paper: Paper }> = ({ paper }) => {
  const actionTicketContext: ActionTicketParams = {
    pageType: 'home',
    actionType: 'view',
    actionArea: 'basedOnActivityPaperList',
    actionTag: 'viewBasedOnActivityPaper',
    actionLabel: String(paper.id),
  };

  const { elRef } = useObserver(0.1, actionTicketContext);

  return (
    <div ref={elRef} className={styles.paperItemContainer}>
      <PaperItem
        paper={paper}
        omitAbstract={true}
        pageType="home"
        actionArea="basedOnActivityPaperList"
        wrapperClassName={styles.paperItemWrapper}
      />
    </div>
  );
};

const BaseOnActivityPaperList: React.FC<BasedOnActivityPaperListProps> = props => {
  const { isLoading, papers } = props;
  const [isPaperExpanding, setIsPaperExpanding] = React.useState(false);

  if (!papers) return null;

  const skeletonPaperItems = range(BASED_ON_ACTIVITY_PAPER_COUNT).map(value => {
    return <SkeletonPaperItem key={value} />;
  });

  if (isLoading) return <>{skeletonPaperItems}</>;

  const targetPapers = isPaperExpanding ? papers : papers.slice(0, BASED_ON_ACTIVITY_PAPER_COUNT);

  const moreButton =
    papers.length <= BASED_ON_ACTIVITY_PAPER_COUNT ? null : (
      <div
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType: 'home',
            actionType: 'fire',
            actionArea: 'basedOnActivityPaperList',
            actionTag: isPaperExpanding ? 'clickSeeLess' : 'clickSeeMore',
            actionLabel: null,
          });
          setIsPaperExpanding(!isPaperExpanding);
        }}
        className={styles.moreItem}
      >
        {isPaperExpanding ? 'See Less' : 'See More'}
        <Icon
          icon="ARROW_POINT_TO_DOWN"
          className={classNames({
            [styles.downIcon]: !isPaperExpanding,
            [styles.upIcon]: isPaperExpanding,
          })}
        />
      </div>
    );

  const activityPapers = targetPapers.map(paper => <ActivityPaperItem key={paper.id} paper={paper} />);

  return (
    <>
      {activityPapers}
      {moreButton}
    </>
  );
};

export default withStyles<typeof BaseOnActivityPaperList>(styles)(BaseOnActivityPaperList);
