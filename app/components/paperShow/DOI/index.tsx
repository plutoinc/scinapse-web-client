import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { trackEvent } from "../../../helpers/handleGA";
import copySelectedTextToClipboard from "../../../helpers/copySelectedTextToClipboard";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { Paper } from "../../../model/paper";
const styles = require("./DOI.scss");

interface PaperShowDOIProps {
  paper: Paper;
  DOI?: string;
}

const PaperShowDOI: React.SFC<PaperShowDOIProps> = props => {
  const { DOI, paper } = props;

  const clickDOIButton = () => {
    copySelectedTextToClipboard(`https://doi.org/${props.DOI}`);
    trackEvent({
      category: "New Paper Show",
      action: "Click Copy DOI in PaperInfo Section",
      label: `Click Copy button for Copy DOI`,
    });

    ActionTicketManager.trackTicket({
      pageType: "paperShow",
      actionType: "fire",
      actionArea: "paperDescription",
      actionTag: "copyDoi",
      actionLabel: String(paper.id),
    });
  };

  return (
    <div className={styles.doi}>
      <div className={styles.paperContentBlockHeader}>
        DOI
        {DOI ? (
          <button className={styles.tinyButton} onClick={clickDOIButton}>
            <Icon icon="COPY_DOI" />
            <span>Copy DOI</span>
          </button>
        ) : (
          <div> - </div>
        )}
      </div>
      <ul className={styles.doiContent}>{DOI || ""}</ul>
    </div>
  );
};

export default withStyles<typeof PaperShowDOI>(styles)(PaperShowDOI);
