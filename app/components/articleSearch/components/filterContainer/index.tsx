import * as React from "react";
import { SEARCH_FILTER_MODE } from "../../types";
import { Link } from "react-router-dom";
const styles = require("./filterContainer.scss");

export interface IFilterContainerProps {
  getPathAddedFilter: (mode: SEARCH_FILTER_MODE, value: number) => string;
  publicationYearFilterValue: number;
  journalIFFilterValue: number;
}

const FilterContainer = ({
  getPathAddedFilter,
  publicationYearFilterValue,
  journalIFFilterValue,
}: IFilterContainerProps) => {
  let filteredPublicationYearFromDiff;

  const isExistPublicationYearFilterValue = !!publicationYearFilterValue;
  if (isExistPublicationYearFilterValue) {
    filteredPublicationYearFromDiff = new Date().getFullYear() - publicationYearFilterValue;
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterTitle}>Publication Year</div>
      <Link
        to={getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, null)}
        className={!filteredPublicationYearFromDiff ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem}
      >
        ALL
      </Link>
      <Link
        to={getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 3)}
        className={
          filteredPublicationYearFromDiff === 3 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem
        }
      >
        Last 3 years
      </Link>
      <Link
        to={getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 5)}
        className={
          filteredPublicationYearFromDiff === 5 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem
        }
      >
        Last 5 years
      </Link>
      <Link
        to={getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 10)}
        className={
          filteredPublicationYearFromDiff === 10 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem
        }
      >
        Last 10 years
      </Link>
      <div className={styles.filterTitle}>Journal IF Filter</div>
      <Link
        to={getPathAddedFilter(SEARCH_FILTER_MODE.JOURNAL_IF, null)}
        className={!journalIFFilterValue ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem}
      >
        ALL
      </Link>
      <Link
        to={getPathAddedFilter(SEARCH_FILTER_MODE.JOURNAL_IF, 10)}
        className={journalIFFilterValue === 10 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem}
      >
        More than 10
      </Link>
      <Link
        to={getPathAddedFilter(SEARCH_FILTER_MODE.JOURNAL_IF, 5)}
        className={journalIFFilterValue === 5 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem}
      >
        More than 5
      </Link>
      <Link
        to={getPathAddedFilter(SEARCH_FILTER_MODE.JOURNAL_IF, 1)}
        className={journalIFFilterValue === 1 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem}
      >
        More than 1
      </Link>
    </div>
  );
};

export default FilterContainer;
