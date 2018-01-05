import * as React from "react";
import { SEARCH_FILTER_MODE } from "../../types";
import { Link } from "react-router-dom";
const styles = require("./filterContainer.scss");

export interface IFilterContainerProps {
  getPathAddedFilter: (mode: SEARCH_FILTER_MODE, value: number) => string;
  publicationYearFilterValue: number;
  journalIFFilterValue: number;
}

const FilterContainer = (props: IFilterContainerProps) => {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterTitle}>Publication Year</div>
      <Link
        to={props.getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, null)}
        className={!props.publicationYearFilterValue ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem}
      >
        ALL
      </Link>
      <Link
        to={props.getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 3)}
        className={
          props.publicationYearFilterValue === 3 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem
        }
      >
        Last 3 years
      </Link>
      <Link
        to={props.getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 5)}
        className={
          props.publicationYearFilterValue === 5 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem
        }
      >
        Last 5 years
      </Link>
      <Link
        to={props.getPathAddedFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 10)}
        className={
          props.publicationYearFilterValue === 10 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem
        }
      >
        Last 10 years
      </Link>
      <div className={styles.filterTitle}>Journal IF Filter</div>
      <Link
        to={props.getPathAddedFilter(SEARCH_FILTER_MODE.JOURNAL_IF, null)}
        className={!props.journalIFFilterValue ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem}
      >
        ALL
      </Link>
      <Link
        to={props.getPathAddedFilter(SEARCH_FILTER_MODE.JOURNAL_IF, 10)}
        className={props.journalIFFilterValue === 10 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem}
      >
        More than 10
      </Link>
      <Link
        to={props.getPathAddedFilter(SEARCH_FILTER_MODE.JOURNAL_IF, 5)}
        className={props.journalIFFilterValue === 5 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem}
      >
        More than 5
      </Link>
      <Link
        to={props.getPathAddedFilter(SEARCH_FILTER_MODE.JOURNAL_IF, 1)}
        className={props.journalIFFilterValue === 1 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem}
      >
        More than 1
      </Link>
    </div>
  );
};

export default FilterContainer;
