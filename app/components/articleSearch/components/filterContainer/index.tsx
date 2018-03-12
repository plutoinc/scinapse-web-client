import * as React from "react";
import { SEARCH_FILTER_MODE } from "../../types";
import FilterItem from "./filterItem";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./filterContainer.scss");

export interface FilterContainerProps {
  getPathAddedFilter: (mode: SEARCH_FILTER_MODE, value: number) => string;
  publicationYearFilterValue: number;
}

const FilterContainer = (props: FilterContainerProps) => {
  const { getPathAddedFilter, publicationYearFilterValue } = props;
  let filteredPublicationYearFromDiff = 0;

  const isExistPublicationYearFilterValue = !!publicationYearFilterValue;
  if (isExistPublicationYearFilterValue) {
    filteredPublicationYearFromDiff = new Date().getFullYear() - publicationYearFilterValue;
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterTitle}>Publication Year</div>
      <FilterItem
        to={getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, null)}
        isSelected={filteredPublicationYearFromDiff === 0}
        content={"ALL"}
        GALabel="PublicationYearAll"
      />
      <FilterItem
        to={getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 3)}
        isSelected={filteredPublicationYearFromDiff === 3}
        content={"Last 3 years"}
        GALabel="PublicationYearLast3Years"
      />
      <FilterItem
        to={getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 5)}
        isSelected={filteredPublicationYearFromDiff === 5}
        content={"Last 5 years"}
        GALabel="PublicationYearLast5Years"
      />
      <FilterItem
        to={getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 10)}
        isSelected={filteredPublicationYearFromDiff === 10}
        content={"Last 10 years"}
        GALabel="PublicationYearLast10Years"
      />
    </div>
  );
};

export default withStyles<typeof FilterContainer>(styles)(FilterContainer);
