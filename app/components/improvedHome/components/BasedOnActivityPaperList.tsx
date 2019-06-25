import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import { Paper } from '../../../model/paper';
import SkeletonPaperItem from '../../common/skeletonPaperItem/skeletonPaperItem';
import PaperItem from '../../common/paperItem';
import { ActionTicketParams } from '../../../helpers/actionTicketManager/actionTicket';
import { useObserver } from '../../../hooks/useIntersectionHook';
import ActionTicketManager from '../../../helpers/actionTicketManager';
const styles = require('./recommendedPapers.scss');

interface BasedOnActivityPaperListProps {
  isLoading: boolean;
  papers: Paper[];
}

const ActivityPaperItem: React.FC<{ paper: Paper }> = ({ paper }) => {
  const actionTicketContext: ActionTicketParams = {
    pageType: 'home',
    actionType: 'view',
    actionArea: 'baseOnActivityPaperList',
    actionTag: 'viewBaseOnActivityPaper',
    actionLabel: String(paper.id),
  };

  const { elRef } = useObserver(0.1, actionTicketContext);

  return (
    <div ref={elRef} className={styles.paperItemContainer}>
      <PaperItem
        paper={paper}
        omitAbstract={true}
        pageType="collectionShow"
        actionArea="relatedPaperList"
        wrapperClassName={styles.paperItemWrapper}
      />
    </div>
  );
};

const BaseOnActivityPaperList: React.FC<BasedOnActivityPaperListProps> = props => {
  const { isLoading, papers } = props;
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
          ActionTicketManager.trackTicket({
            pageType: 'home',
            actionType: 'fire',
            actionArea: 'baseOnActivityPaperList',
            actionTag: isPaperExpanding ? 'clickSeeLess' : 'clickSeeMore',
            actionLabel: null,
          });
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

  const activityPapers = targetPapers.map(paper => <ActivityPaperItem key={paper.id} paper={paper} />);

  return (
    <>
      {activityPapers}
      {moreButton}
    </>
  );
};

export default withStyles<typeof BaseOnActivityPaperList>(styles)(BaseOnActivityPaperList);
