import * as React from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import * as isToday from "date-fns/is_today";
import * as classNames from "classnames";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import { Paper } from "../../model/paper";
import RelatedPaperItem from "../paperShow/components/relatedPaperItem";
const store = require("store");
const s = require("./researchHistory.scss");

const RESEARCH_HISTORY_KEY = "r_h_list";
const MAXIMUM_COUNT = 50;

interface HistoryPaper extends Paper {
  savedAt: number; // Unix time
}

interface ResearchHistoryProps {
  paper: Paper | undefined;
}
const ResearchHistory: React.FunctionComponent<ResearchHistoryProps> = ({ paper }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [papers, setPapers] = React.useState<HistoryPaper[]>([]);

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
      }
    },
    [paper]
  );

  const todayPapers = papers.filter(p => p.savedAt && isToday(p.savedAt));
  const countBtn = todayPapers.length === 0 ? null : <div className={s.countBtn}>{todayPapers.length}</div>;
  const innerContent = (
    <div className={s.paperListWrapper}>
      {papers.length > 0 ? (
        papers.map(p => <RelatedPaperItem key={p.id} paper={p} actionArea="researchHistory" disableVisitedColour />)
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

export default withStyles<typeof ResearchHistory>(s)(ResearchHistory);
