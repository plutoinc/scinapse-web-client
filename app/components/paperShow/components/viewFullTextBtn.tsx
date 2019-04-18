import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
const styles = require("./viewFullTextBtn.scss");

interface ViewFullTextBtnProps {
  handleClickFullText: () => void;
}

const ViewFullTextBtn: React.FunctionComponent<ViewFullTextBtnProps> = props => {
  return (
    <button className={styles.btnStyle} onClick={props.handleClickFullText}>
      <Icon className={styles.pdfIcon} icon={"PDF_PAPER"} />View Full-Text
    </button>
  );
};

export default withStyles<typeof ViewFullTextBtn>(styles)(ViewFullTextBtn);
