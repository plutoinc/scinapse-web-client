import * as React from "react";
import { Link } from "react-router-dom";
import { FILTER_BOX_TYPE } from "../../constants/paperSearch";
import { withStyles } from "../../helpers/withStylesHelper";
import makeNewFilterLink from "../../helpers/makeNewFilterLink";
const styles = require("./filterResetButton.scss");

interface FilterResetButtonProps {
  filterType?: FILTER_BOX_TYPE;
}

function getFilterObject(filterType?: FILTER_BOX_TYPE) {
  if (!!filterType) {
    const returnValue =
      filterType === "PUBLISHED_YEAR" ? { yearFrom: undefined, yearTo: undefined } : { [filterType.toLowerCase()]: [] };

    return returnValue;
  } else {
    return {
      yearFrom: undefined,
      yearTo: undefined,
      fos: [],
      journal: [],
    };
  }
}

const FilterResetButton: React.FunctionComponent<FilterResetButtonProps> = props => {
  const { filterType } = props;

  return (
    <Link
      to={makeNewFilterLink(!!filterType ? getFilterObject(filterType) : getFilterObject())}
      className={styles.resetButtonWrapper}
    >
      Reset
    </Link>
  );
};

export default withStyles<typeof FilterResetButton>(styles)(FilterResetButton);
