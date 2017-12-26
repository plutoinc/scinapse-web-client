import * as React from "react";
import { SEARCH_FILTER_MODE } from "../../index";
const styles = require("./filterContainer.scss");

export interface IFilterContainerProps {
  addFilter: (mode: SEARCH_FILTER_MODE, value: number) => void;
}

const FilterContainer = (props: IFilterContainerProps) => {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterTitle}>Publication Year</div>
      <div
        onClick={() => {
          props.addFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 3);
        }}
        className={styles.filterItem}
      >
        Last 3 years
      </div>
      <div
        onClick={() => {
          props.addFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 5);
        }}
        className={styles.filterItem}
      >
        Last 5 years
      </div>
      <div
        onClick={() => {
          props.addFilter(SEARCH_FILTER_MODE.PUBLICATION_YEAR, 10);
        }}
        className={styles.filterItem}
      >
        Last 10 years
      </div>
      <div className={styles.filterTitle}>Journal IF Filter</div>
      <div className={styles.filterItem}>More than 10</div>
      <div className={styles.filterItem}>More than 5</div>
      <div className={styles.filterItem}>More than 1</div>
      <div className={styles.filterItem}>More than 0.5</div>
    </div>
  );
};

export default FilterContainer;
