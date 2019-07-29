import * as React from 'react';
import { groupBy } from 'lodash';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import * as isToday from 'date-fns/is_today';
import * as classNames from 'classnames';
import { withStyles } from '../../helpers/withStylesHelper';
import Icon from '../../icons';
import { Paper } from '../../model/paper';
import RelatedPaperItem from '../paperShow/components/relatedPaperItem';
import { getCurrentPageType } from '../locationListener';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { withRouter, RouteComponentProps } from 'react-router-dom';
const store = require('store');
const s = require('./researchHistory.scss');

export const RESEARCH_HISTORY_KEY = 'r_h_list';
const MAXIMUM_COUNT = 100;

export interface HistoryPaper extends Paper {
  savedAt: number; // Unix time
}

interface AggregatedPaper {
  aggregatedDate: string;
  historyPaper: HistoryPaper;
}

interface ResearchHistoryProps extends RouteComponentProps<any> {
  paper: Paper | undefined;
  isLoggedIn: boolean;
}

function aggregatedHistoryPaper(rawPapers: HistoryPaper[]) {
  if (rawPapers.length === 0) return null;
  const rawAggregatedPapers: AggregatedPaper[] = rawPapers.map(rawPaper => {
    const date = new Date(rawPaper.savedAt);
    const dateStr = date.toDateString();
    return { aggregatedDate: dateStr, historyPaper: rawPaper };
  });
  const aggregatedPapers = groupBy(rawAggregatedPapers, rawAggregatedPapers => rawAggregatedPapers.aggregatedDate);
  return aggregatedPapers;
}

const ResearchHistory: React.FunctionComponent<ResearchHistoryProps> = ({ paper, isLoggedIn, location }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [papers, setPapers] = React.useState<HistoryPaper[]>([]);
  const [aggregatedPapers, setAggregatedPapers] = React.useState();
  const currentLocation = React.useRef(location);

  React.useEffect(
    () => {
      if (isLoggedIn) {
        setPapers(store.get(RESEARCH_HISTORY_KEY) || []);
        setAggregatedPapers(aggregatedHistoryPaper(store.get(RESEARCH_HISTORY_KEY) || []));
      }
    },
    [isLoggedIn]
  );

  React.useEffect(
    () => {
      if (location !== currentLocation.current) {
        setIsOpen(false);
        currentLocation.current = location;
      }
    },
    [location]
  );

  React.useEffect(
    () => {
      if (!!paper) {
        const now = Date.now();
        const newPaper: HistoryPaper | null = { ...paper, savedAt: now };
        const oldPapers: HistoryPaper[] = store.get(RESEARCH_HISTORY_KEY) || [];
        const i = oldPapers.findIndex(p => String(p.id) === String(paper.id));
        const newPapers =
          i > -1
            ? [newPaper, ...oldPapers.slice(0, i), ...oldPapers.slice(i + 1)]
            : [newPaper, ...oldPapers].slice(0, MAXIMUM_COUNT);
        store.set(RESEARCH_HISTORY_KEY, newPapers);
        setPapers(newPapers);
        setAggregatedPapers(aggregatedHistoryPaper(newPapers));
      }
    },
    [paper]
  );

  const todayPapers = papers.filter(p => p.savedAt && isToday(p.savedAt));
  const countBtn = todayPapers.length === 0 ? null : <div className={s.countBtn}>{todayPapers.length}</div>;
  const aggregatedDates = aggregatedPapers && Object.keys(aggregatedPapers);
  const innerContent = (
    <div className={s.paperListWrapper}>
      {aggregatedDates && aggregatedDates.length > 0 ? (
        aggregatedDates.map((date, i) => {
          const today = new Date();
          const finalDate = today.toDateString() === date ? 'Today' : date;
          const contents = aggregatedPapers[date].map((paper: AggregatedPaper) => (
            <RelatedPaperItem
              key={paper.historyPaper.id}
              paper={paper.historyPaper}
              actionArea="researchHistory"
              disableVisitedColour
            />
          ));

          return (
            <div className={s.historyItemWrapper} key={i}>
              <div className={s.dayLabel}>{finalDate}</div>
              {contents}
            </div>
          );
        })
      ) : (
        <span className={s.noHistoryContext}>Browse Scinapse! Your research history will be here.</span>
      )}
    </div>
  );

  const paperList = isOpen ? innerContent : null;

  const content = (
    <>
      <div
        className={s.headerWrapper}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            ActionTicketManager.trackTicket({
              pageType: getCurrentPageType(),
              actionType: 'fire',
              actionArea: 'topBar',
              actionTag: 'researchHistory',
              actionLabel: `${todayPapers.length}`,
            });
          }
        }}
      >
        <Icon className={s.historyIcon} icon="HISTORY" />
        <div className={s.sectionTitle}>History</div>
        {countBtn}
      </div>
      <div className={classNames({ [s.boxWrapper]: isOpen })}>{paperList}</div>
    </>
  );

  if (isOpen) {
    return (
      <ClickAwayListener
        onClickAway={() => {
          setIsOpen(false);
        }}
      >
        <div className={s.openBoxWrapper}>{content}</div>
      </ClickAwayListener>
    );
  }

  return <>{content}</>;
};

export default withRouter(withStyles<typeof ResearchHistory>(s)(ResearchHistory));
