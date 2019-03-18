import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./filterSaveButton.scss");

interface FilterSaveButtonProps {
  text: string;
  buttonStyle?: React.CSSProperties;
  handleClickSaveBtn: () => void;
}

const FilterSaveButton: React.FunctionComponent<FilterSaveButtonProps> = props => {
  return (
    <div onClick={() => props.handleClickSaveBtn()} style={props.buttonStyle} className={styles.filterSaveButton}>
      {props.text}
    </div>
  );
};

export default withStyles<typeof FilterSaveButton>(styles)(FilterSaveButton);
