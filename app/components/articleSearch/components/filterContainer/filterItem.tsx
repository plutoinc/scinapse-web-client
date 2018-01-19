import { Link } from "react-router-dom";
import * as React from "react";

const styles = require("./filterItem.scss");

export interface IFilterItemProps {
  isSelected: boolean;
  to: string;
  content: string;
}

const FilterItem = (props: IFilterItemProps) => {
  const { isSelected, to, content } = props;

  return (
    <Link to={to} className={isSelected ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem}>
      {content}
    </Link>
  );
};

export default FilterItem;
