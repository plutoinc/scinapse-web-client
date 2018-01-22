import { Link } from "react-router-dom";
import * as React from "react";
import { trackSearch } from "../../../../helpers/handleGA";

const styles = require("./filterItem.scss");

export interface IFilterItemProps {
  isSelected: boolean;
  to: string;
  content: string;
  GALabel: string;
}

const FilterItem = (props: IFilterItemProps) => {
  const { isSelected, to, content, GALabel } = props;

  return (
    <Link
      to={to}
      onClick={() => trackSearch("filter", GALabel)}
      className={isSelected ? `${styles.filterItem} ${styles.isSelected}` : styles.filterItem}
    >
      {content}
    </Link>
  );
};

export default FilterItem;
