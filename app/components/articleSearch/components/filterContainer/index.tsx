import * as React from "react";
import { SEARCH_FILTER_MODE } from "../../types";
import FilterItem from "./filterItem";
const styles = require("./filterContainer.scss");

export interface IFilterContainerProps {
  getPathAddedFilter: (mode: SEARCH_FILTER_MODE, value: number) => string;
  publicationYearFilterValue: number;
  journalIFFilterValue: number;
}

const FilterContainer = (props: IFilterContainerProps) => {
  const { getPathAddedFilter, publicationYearFilterValue, journalIFFilterValue } = props;
  let filteredPublicationYearFromDiff;

  const isExistPublicationYearFilterValue = !!publicationYearFilterValue;
  if (isExistPublicationYearFilterValue) {
    filteredPublicationYearFromDiff = new Date().getFullYear() - publicationYearFilterValue;
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterTitle}>Publication Year</div>
      <FilterItem
        to={getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, null)}
        isSelected={!filteredPublicationYearFromDiff}
        content={"ALL"}
      />
      <FilterItem
        to={getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 3)}
        isSelected={filteredPublicationYearFromDiff === 3}
        content={"Last 3 years"}
      />
      <FilterItem
        to={getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 5)}
        isSelected={filteredPublicationYearFromDiff === 5}
        content={"Last 5 years"}
      />
      <FilterItem
        to={getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 10)}
        isSelected={filteredPublicationYearFromDiff === 10}
        content={"Last 10 years"}
      />
      <div className={styles.filterTitle}>Journal IF Filter</div>
      <FilterItem
        to={getPathAddedFilter(SEARCH_FILTER_MODE.JOURNAL_IF, null)}
        isSelected={!journalIFFilterValue}
        content={"ALL"}
      />
      <FilterItem
        to={getPathAddedFilter(SEARCH_FILTER_MODE.JOURNAL_IF, 10)}
        isSelected={journalIFFilterValue === 10}
        content={"More than 10"}
      />
      <FilterItem
        to={getPathAddedFilter(SEARCH_FILTER_MODE.JOURNAL_IF, 5)}
        isSelected={journalIFFilterValue === 5}
        content={"More than 5"}
      />
      <FilterItem
        to={getPathAddedFilter(SEARCH_FILTER_MODE.JOURNAL_IF, 1)}
        isSelected={journalIFFilterValue === 1}
        content={"More than 1"}
      />
    </div>
  );
};

export default FilterContainer;
