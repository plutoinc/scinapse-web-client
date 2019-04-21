import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import copySelectedTextToClipboard from "../../../helpers/copySelectedTextToClipboard";
import { trackEvent } from "../../../helpers/handleGA";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import Icon from "../../../icons";
const styles = require("./doiInPaperShow.scss");

interface DoiInPaperShowProps {
  doi: string;
  paperId: number;
}

const DoiInPaperShow: React.FunctionComponent<DoiInPaperShowProps> = props => {
  const { doi, paperId } = props;

  const clickDOIButton = () => {
    copySelectedTextToClipboard(`https://doi.org/${doi}`);
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
      actionLabel: String(paperId),
    });
  };

  return (
    <div className={styles.doiWrapper}>
      <span className={styles.doiTitle}>· DOI :</span>
      <span className={styles.doiContext}>{doi}</span>
      <button className={styles.tinyButton} onClick={clickDOIButton}>
        <Icon icon="COPY_DOI" />
        <span>Copy DOI</span>
      </button>
    </div>
  );
};

export default withStyles<typeof styles>(styles)(DoiInPaperShow);
