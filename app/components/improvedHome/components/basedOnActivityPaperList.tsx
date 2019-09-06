import React from 'react';
import { range } from 'lodash';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
import SkeletonPaperItem from '../../common/skeletonPaperItem/skeletonPaperItem';
import PaperItem from '../../common/paperItem/paperItem';
import { ActionTicketParams } from '../../../helpers/actionTicketManager/actionTicket';
import { useObserver } from '../../../hooks/useIntersectionHook';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
const styles = require('./recommendedPapers.scss');
const BASED_ON_ACTIVITY_PAPER_COUNT = 5;

interface BasedOnActivityPaperListProps {
  isLoading: boolean;
  doRandomizeRec: boolean;
  refreshBasedOnActivityPapers: (random: boolean) => void;
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
    <div ref={elRef} className={styles.paperItemWrapper}>
      <PaperItem paper={paper} omitAbstract={true} pageType="home" actionArea="basedOnActivityPaperList" />
    </div>
  );
};

const BaseOnActivityPaperList: React.FC<BasedOnActivityPaperListProps> = props => {
  const { isLoading, doRandomizeRec, papers, refreshBasedOnActivityPapers } = props;

  if (!papers) return null;

  const skeletonPaperItems = range(BASED_ON_ACTIVITY_PAPER_COUNT).map(value => {
    return <SkeletonPaperItem key={value} />;
  });

  if (isLoading) return <>{skeletonPaperItems}</>;

  const targetPaper = papers;

  const refreshButton = (
    <div
      className={styles.refreshBottomButton}
      onClick={() => {
        refreshBasedOnActivityPapers(doRandomizeRec);
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
      {refreshButton}
    </>
  );
};

export default withStyles<typeof BaseOnActivityPaperList>(styles)(BaseOnActivityPaperList);
