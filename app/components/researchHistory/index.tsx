import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
const s = require("./researchHistory.scss");

const ResearchHistory: React.FunctionComponent = () => {
  return (
    <div>
      <Icon icon="HISTORY" />
      <div>Your Research History</div>
      <div>
        <div>16 Today</div>
        <div>arrow down icon</div>
      </div>
    </div>
  );
};

export default withStyles<typeof ResearchHistory>(s)(ResearchHistory);
