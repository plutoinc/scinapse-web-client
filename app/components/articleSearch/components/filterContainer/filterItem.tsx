import { Link } from "react-router-dom";
import * as React from "react";

const styles = require("./filterItem.scss");

export interface IFilterItemProps {
  isSelected: boolean;
  to: string;
  content: string;
}

const FilterItem = ({ isSelected, to, content }: IFilterItemProps) => {
  return (
    <Link to={to} className={isSelected ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem}>
      {content}
    </Link>
  );
};

export default FilterItem;
