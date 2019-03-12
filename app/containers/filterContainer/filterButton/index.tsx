import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";

const styles = require("./filterButton.scss");

interface FilterButtonProps {
  text: string;
  isActive: boolean;
  onClick: () => void;
  onToggleClick: () => void;
}

const FilterButton: React.FunctionComponent<FilterButtonProps> = props => {
  return (
    <button
      className={classNames({
        [styles.button]: true,
        [styles.isActive]: props.isActive,
      })}
      onClick={props.isActive ? props.onToggleClick : props.onClick}
    >
      {props.text}
    </button>
  );
};

export default withStyles<typeof FilterButton>(styles)(FilterButton);
