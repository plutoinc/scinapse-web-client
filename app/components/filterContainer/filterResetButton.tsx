import * as React from "react";
import { FILTER_BOX_TYPE } from "../../constants/paperSearch";
import { withStyles } from "../../helpers/withStylesHelper";
import { FilterObject } from "../../helpers/papersQueryFormatter";
import { Link } from "react-router-dom";
const styles = require("./filterResetButton.scss");

interface FilterResetButtonProps {
  filterType?: FILTER_BOX_TYPE;
  makeNewFilterLink: (newFilter: FilterObject) => string;
}

const FilterResetButton: React.FunctionComponent<FilterResetButtonProps> = props => {
  const { filterType, makeNewFilterLink } = props;

  const resetButton = !!filterType ? (
    <Link
      to={makeNewFilterLink(
        filterType === "PUBLISHED_YEAR"
          ? {
              yearFrom: undefined,
              yearTo: undefined,
            }
          : { [filterType.toLowerCase()]: [] }
      )}
      className={styles.resetButtonWrapper}
    >
      Reset
    </Link>
  ) : (
    <Link
      to={makeNewFilterLink({
        yearFrom: undefined,
        yearTo: undefined,
        fos: [],
        journal: [],
      })}
      className={styles.resetButtonWrapper}
    >
      Reset All
    </Link>
  );

  return resetButton;
};

export default withStyles<typeof FilterResetButton>(styles)(FilterResetButton);
