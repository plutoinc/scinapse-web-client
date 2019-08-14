import React from 'react';
import { range } from 'lodash';
import classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
import SkeletonPaperItem from '../../common/skeletonPaperItem/skeletonPaperItem';
import PaperItem from '../../common/paperItem';
import { ActionTicketParams } from '../../../helpers/actionTicketManager/actionTicket';
import { useObserver } from '../../../hooks/useIntersectionHook';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
const styles = require('./recommendedPapers.scss');
const BASED_ON_ACTIVITY_PAPER_COUNT = 5;

interface BasedOnActivityPaperListProps {
  isLoading: boolean;
  doRandomizeRec: boolean;
  refreshBasedOnActivityPapers: () => void;
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
  const { isLoading, doRandomizeRec, papers, refreshBasedOnActivityPapers } = props;
  const [isPaperExpanding, setIsPaperExpanding] = React.useState(false);

  if (!papers) return null;

  const skeletonPaperItems = range(BASED_ON_ACTIVITY_PAPER_COUNT).map(value => {
    return <SkeletonPaperItem key={value} />;
  });

  if (isLoading) return <>{skeletonPaperItems}</>;

  const targetPaper = doRandomizeRec || isPaperExpanding ? papers : papers.slice(0, BASED_ON_ACTIVITY_PAPER_COUNT);

  const moreButton =
    papers.length <= BASED_ON_ACTIVITY_PAPER_COUNT || doRandomizeRec ? null : (
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

  const refreshButton = doRandomizeRec && (
    <div
      className={styles.refreshBottomButton}
      onClick={() => {
        refreshBasedOnActivityPapers();
        ActionTicketManager.trackTicket({
          pageType: 'home',
          actionType: 'fire',
          actionArea: 'basedOnActivityPaperList',
          actionTag: 'clickRefreshButton',
          actionLabel: null,
        });
      }}
    >
      <Icon className={styles.refreshIcon} icon="RELOAD" />REFRESH
    </div>
  );

  const activityPapers = targetPaper.map(paper => <ActivityPaperItem key={paper.id} paper={paper} />);

  return (
    <>
      {activityPapers}
      {moreButton}
      {refreshButton}
    </>
  );
};

export default withStyles<typeof BaseOnActivityPaperList>(styles)(BaseOnActivityPaperList);
