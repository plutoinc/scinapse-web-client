import * as React from "react";
const styles = require("./filterContainer.scss");

export interface IFilterContainerProps {}

const FilterContainer = (props: IFilterContainerProps) => {
  console.log(props);
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterTitle}>Publication Year</div>
      <div className={styles.filterItem}>Last 3 years</div>
      <div className={styles.filterItem}>Last 5 years</div>
      <div className={styles.filterItem}>Last 10 years</div>
      <div className={styles.filterTitle}>Journal IF Filter</div>
      <div className={styles.filterItem}>More than 10</div>
      <div className={styles.filterItem}>More than 5</div>
      <div className={styles.filterItem}>More than 1</div>
      <div className={styles.filterItem}>More than 0.5</div>
    </div>
  );
};

export default FilterContainer;
