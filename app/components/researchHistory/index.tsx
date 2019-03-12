import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
const s = require("./researchHistory.scss");

const ResearchHistory: React.FunctionComponent = () => {
  return (
    <div className={s.sectionWrapper}>
      <Icon className={s.historyIcon} icon="HISTORY" />
      <div className={s.sectionTitle}>Your Research History</div>
      <div className={s.rightSection}>
        <div className={s.countBtn}>16 Today</div>
        <Icon icon="ARROW_POINT_TO_UP" className={s.arrowIcon} />
      </div>
    </div>
  );
};

export default withStyles<typeof ResearchHistory>(s)(ResearchHistory);
