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
  paper: Paper;
}
const ResearchHistory: React.FunctionComponent<ResearchHistoryProps> = ({ paper }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [papers, setPapers] = React.useState<HistoryPaper[]>([]);

  React.useEffect(
    () => {
      const now = Date.now();
      const newPaper: HistoryPaper = { ...paper, savedAt: now };
      const oldPapers: HistoryPaper[] = store.get(RESEARCH_HISTORY_KEY) || [];
      const i = oldPapers.findIndex(p => String(p.id) === String(paper.id));
      const newPapers =
        i > -1
          ? [newPaper, ...oldPapers.slice(0, i), ...oldPapers.slice(i + 1)]
          : [newPaper, ...oldPapers].slice(0, MAXIMUM_COUNT);
      store.set(RESEARCH_HISTORY_KEY, newPapers);
      setPapers(newPapers);
    },
    [paper]
  );

  const todayPapers = papers.filter(p => p.savedAt && isToday(p.savedAt));
  const countBtn = isOpen ? null : <div className={s.countBtn}>{`${todayPapers.length} Today`}</div>;
  const paperList = isOpen ? (
    <div className={s.paperListWrapper}>
      {papers.map(p => <RelatedPaperItem key={p.id} paper={p} actionArea="researchHistory" />)}
    </div>
  ) : null;

  const content = (
    <div
      className={classNames({
        [s.boxWrapper]: isOpen,
      })}
    >
      <div
        className={classNames({
          [s.headerWrapper]: true,
          [s.openHeaderWrapper]: isOpen,
        })}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <Icon className={s.historyIcon} icon="HISTORY" />
        <div className={s.sectionTitle}>Your Research History</div>
        <div className={s.rightSection}>
          {countBtn}
          <Icon
            style={{
              transform: isOpen ? "none" : "rotate(180deg)",
            }}
            icon="ARROW_POINT_TO_UP"
            className={s.arrowIcon}
          />
        </div>
      </div>
      {paperList}
    </div>
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
