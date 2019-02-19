import * as React from "react";
import { FILTER_BOX_TYPE } from "../../constants/paperSearch";
import { ArticleSearchState } from "../articleSearch/records";
import { withStyles } from "../../helpers/withStylesHelper";
import { FilterObject } from "../../helpers/papersQueryFormatter";
import { Link } from "react-router-dom";
const styles = require("./filterResetButton.scss");

interface FilterResetButtonProps {
  filterType: FILTER_BOX_TYPE;
  makeNewFilterLink: (newFilter: FilterObject) => string;
  articleSearchState: ArticleSearchState;
}

const FilterResetButton: React.FunctionComponent<FilterResetButtonProps> = props => {
  const { filterType, articleSearchState, makeNewFilterLink } = props;
  const [isAvailable, setIsAvailable] = React.useState(false);

  switch (filterType) {
    case "PUBLISHED_YEAR":
      const pubYearFilter = { to: articleSearchState.yearFilterToValue, from: articleSearchState.yearFilterFromValue };
      if (pubYearFilter.to !== 0 || pubYearFilter.from !== 0) {
        React.useEffect(() => {
          setIsAvailable(true);
        });
      } else {
        React.useEffect(() => {
          setIsAvailable(false);
        });
      }
      break;
    case "FOS":
      const fosFilter = articleSearchState.fosFilter;
      if (!!fosFilter && fosFilter.length > 0) {
        React.useEffect(() => {
          setIsAvailable(true);
        });
      } else {
        React.useEffect(() => {
          setIsAvailable(false);
        });
      }
      break;
    case "JOURNAL":
      const journalFilter = articleSearchState.journalFilter;
      if (!!journalFilter && journalFilter.length > 0) {
        React.useEffect(() => {
          setIsAvailable(true);
        });
      } else {
        React.useEffect(() => {
          setIsAvailable(false);
        });
      }
      break;
    default:
      break;
  }

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

  return isAvailable ? resetButton : null;
};

export default withStyles<typeof FilterResetButton>(styles)(FilterResetButton);
