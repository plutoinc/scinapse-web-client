import * as React from "react";
import { FILTER_BOX_TYPE } from "../../constants/paperSearch";
import { withStyles } from "../../helpers/withStylesHelper";
import { FilterObject } from "../../helpers/papersQueryFormatter";
import { Link } from "react-router-dom";
const styles = require("./filterResetButton.scss");

interface FilterResetButtonProps {
  filterType: FILTER_BOX_TYPE;
  makeNewFilterLink: (newFilter: FilterObject) => string;
}

const FilterResetButton: React.FunctionComponent<FilterResetButtonProps> = props => {
  const { filterType, makeNewFilterLink } = props;

  const resetButton = (
    <Link
      to={makeNewFilterLink(
        filterType === "PUBLISHED_YEAR"
          ? {
              yearFrom: undefined,
              yearTo: undefined,
            }
          : { [filterType.toLowerCase()]: null }
      )}
      className={styles.resetButtonWrapper}
    >
      Reset
    </Link>
  );

  return resetButton;
};

export default withStyles<typeof FilterResetButton>(styles)(FilterResetButton);
