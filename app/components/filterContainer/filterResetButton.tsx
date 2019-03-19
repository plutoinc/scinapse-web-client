import * as React from "react";
import { Link } from "react-router-dom";
import { FILTER_BOX_TYPE } from "../../constants/paperSearch";
import { withStyles } from "../../helpers/withStylesHelper";
import makeNewFilterLink from "../../helpers/makeNewFilterLink";
import PapersQueryFormatter from "../../helpers/papersQueryFormatter";
const styles = require("./filterResetButton.scss");

interface FilterResetButtonProps {
  filterType?: FILTER_BOX_TYPE;
  currentSavedFilterSet?: string;
  btnStyle?: React.CSSProperties;
}

function getFilterObject(props: FilterResetButtonProps) {
  const { filterType, currentSavedFilterSet } = props;

  if (!!currentSavedFilterSet && currentSavedFilterSet.length > 0) {
    return PapersQueryFormatter.objectifyPapersFilter(currentSavedFilterSet);
  }

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
  return (
    <Link to={makeNewFilterLink(getFilterObject(props))} className={styles.resetButtonWrapper} style={props.btnStyle}>
      Reset
    </Link>
  );
};

export default withStyles<typeof FilterResetButton>(styles)(FilterResetButton);
