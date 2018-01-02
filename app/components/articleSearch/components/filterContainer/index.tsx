import * as React from "react";
import { SEARCH_FILTER_MODE } from "../../types";
const styles = require("./filterContainer.scss");

export interface IFilterContainerProps {
  addFilter: (mode: SEARCH_FILTER_MODE, value: number) => void;
  publicationYearFilterValue: number;
}

const FilterContainer = (props: IFilterContainerProps) => {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterTitle}>Publication Year</div>
      <div
        onClick={() => {
          props.addFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, null);
        }}
        className={
          props.publicationYearFilterValue === undefined
            ? `${styles.filterItem} ${styles.isSelected}`
            : styles.filterItem
        }
      >
        ALL
      </div>
      <div
        onClick={() => {
          props.addFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 3);
        }}
        className={
          props.publicationYearFilterValue === 3 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem
        }
      >
        Last 3 years
      </div>
      <div
        onClick={() => {
          props.addFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 5);
        }}
        className={
          props.publicationYearFilterValue === 5 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem
        }
      >
        Last 5 years
      </div>
      <div
        onClick={() => {
          props.addFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 10);
        }}
        className={
          props.publicationYearFilterValue === 10 ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem
        }
      >
        Last 10 years
      </div>
      <div className={styles.filterTitle}>Journal IF Filter</div>
      <div className={styles.filterItem}>ALL</div>
      <div className={styles.filterItem}>More than 10</div>
      <div className={styles.filterItem}>More than 5</div>
      <div className={styles.filterItem}>More than 1</div>
      <div className={styles.filterItem}>More than 0.5</div>
    </div>
  );
};

export default FilterContainer;
