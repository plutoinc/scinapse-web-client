import * as React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PaperAPI from "../../api/paper";
import { Paper } from "../../model/paper";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import ActionTicketManager from "../../helpers/actionTicketManager";
import alertToast from "../../helpers/makePlutoToastAction";
const store = require("store");
const styles = require("./nextPaperTab.scss");

const RESEARCH_HISTORY_KEY = "r_h_list";

interface NextPaperTabProps {
  paperId: number;
}

const NextPaperTab: React.FunctionComponent<NextPaperTabProps> = ({ paperId }) => {
  const [paperList, setPaperList] = React.useState<Paper[]>([]);

  React.useEffect(
    () => {
      const cancelToken = axios.CancelToken.source();
      PaperAPI.getRelatedPapers({ paperId, cancelToken: cancelToken.token })
        .then(papers => {
          setPaperList(papers);
        })
        .catch(err => {
          if (!axios.isCancel(err)) {
            alertToast({
              type: "error",
              message: `Failed to get related papers. ${err.message}`,
            });
          }
        });

      return () => {
        cancelToken.cancel();
      };
    },
    [paperId]
  );

  if (paperList.length === 0) return null;

  let nextPaper = paperList[0];
  const prevVisitPapers: Paper[] = store.get(RESEARCH_HISTORY_KEY);
  if (prevVisitPapers && prevVisitPapers.length >= 2) {
    const prevVisitPaper = prevVisitPapers[1];
    if (paperList[0].id === prevVisitPaper.id) {
      nextPaper = paperList[Math.floor(Math.random() * (paperList.length - 1)) + 1];
    }
  }
  return (
    <Link
      className={styles.nextPaperTabWrapper}
      onClick={() => {
        ActionTicketManager.trackTicket({
          pageType: "paperShow",
          actionType: "fire",
          actionArea: "nextPaper",
          actionTag: "paperShow",
          actionLabel: nextPaper.id.toString(),
        });
      }}
      to={`/papers/${nextPaper.id}`}
    >
      <div className={styles.nextPaperTab}>
        <span className={styles.nextPaperTabTitle}>View next paper</span>
        <span className={styles.nextPaperTabContent}>{nextPaper.title}</span>
        <Icon className={styles.arrowRightIcon} icon="ARROW_RIGHT" />
      </div>
    </Link>
  );
};

export default withStyles<typeof NextPaperTab>(styles)(NextPaperTab);
