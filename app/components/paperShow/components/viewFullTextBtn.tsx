import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import SearchingPDFBtn from "./searchingPDFBtn";
import ActionTicketManager from "../../../helpers/actionTicketManager";

const styles = require("./viewFullTextBtn.scss");

interface ViewFullTextBtnProps {
  paperId: number;
  handleClickFullText: () => void;
  isLoadingOaCheck: boolean;
}

const ViewFullTextBtn: React.FunctionComponent<ViewFullTextBtnProps> = props => {
  const { isLoadingOaCheck, handleClickFullText } = props;

  if (isLoadingOaCheck) {
    return <SearchingPDFBtn hasLoadingOaCheck={isLoadingOaCheck} />;
  }

  return (
    <button
      className={styles.btnStyle}
      onClick={() => {
        ActionTicketManager.trackTicket({
          pageType: "paperShow",
          actionType: "fire",
          actionArea: "paperDescription",
          actionTag: "viewFullText",
          actionLabel: String(props.paperId),
        });
        handleClickFullText();
      }}
    >
      <Icon className={styles.pdfIcon} icon={"PDF_PAPER"} />View Full-Text
    </button>
  );
};

export default withStyles<typeof ViewFullTextBtn>(styles)(ViewFullTextBtn);
