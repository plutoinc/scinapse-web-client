import * as React from "react";
import { Link } from "react-router-dom";
import * as classNames from "classnames";
import { withStyles } from "../../helpers/withStylesHelper";
import { trackSelectFilter } from "./trackSelectFilter";
const styles = require("./yearFilter.scss");

const YearFilter: React.SFC<{
  fromNow: number;
  isSelected: boolean;
  paperCount: string;
  to: string;
}> = ({ fromNow, isSelected, paperCount, to }) => {
  return (
    <Link
      onClick={() => {
        trackSelectFilter("PUBLISHED_YEAR", `currentYear - ${fromNow}`);
      }}
      to={to}
      className={classNames({
        [`${styles.filterItem}`]: true,
        [`${styles.isSelected}`]: isSelected,
      })}
    >
      <span className={styles.linkTitle}>{`Last ${fromNow} years`}</span>
      <span className={styles.countBox}>{paperCount}</span>
    </Link>
  );
};

export default withStyles<typeof YearFilter>(styles)(YearFilter);
