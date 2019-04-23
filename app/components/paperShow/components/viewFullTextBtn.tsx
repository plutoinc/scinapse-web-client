import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import CircularProgress from "@material-ui/core/CircularProgress";
const styles = require("./viewFullTextBtn.scss");

interface ViewFullTextBtnProps {
  handleClickFullText: () => void;
  isLoadingOaCheck: boolean;
}

const ViewFullTextBtn: React.FunctionComponent<ViewFullTextBtnProps> = props => {
  const { isLoadingOaCheck, handleClickFullText } = props;

  if (isLoadingOaCheck) {
    return (
      <button className={styles.loadingBtnStyle} disabled={isLoadingOaCheck}>
        <div className={styles.spinnerWrapper}>
          <CircularProgress color="inherit" disableShrink={true} size={14} thickness={4} />
        </div>
        Searching PDF
      </button>
    );
  }

  return (
    <button className={styles.btnStyle} onClick={handleClickFullText}>
      <Icon className={styles.pdfIcon} icon={"PDF_PAPER"} />View Full-Text
    </button>
  );
};

export default withStyles<typeof ViewFullTextBtn>(styles)(ViewFullTextBtn);
