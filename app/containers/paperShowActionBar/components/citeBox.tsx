import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Paper } from "../../../model/paper";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
import { trackEvent } from "../../../helpers/handleGA";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { shouldBlockToSignUp } from "../../../helpers/shouldBlockToSignUp";
import Icon from "../../../icons";
const s = require("./citeBox.scss");

interface CiteBoxProps {
  paper: Paper;
}

const CiteBox: React.FunctionComponent<CiteBoxProps> = props => {
  if (!props.paper.doi) return null;
  return (
    <div
      className={s.citeButton}
      onClick={() => {
        const shouldBlock = shouldBlockToSignUp("paperDescription", "citePaper");
        if (shouldBlock) {
          return;
        }
        GlobalDialogManager.openCitationDialog(props.paper.id);
        trackEvent({
          category: "New Paper Show",
          action: "Click Citation Button in PaperShow ActionBar",
          label: `Try to cite this Paper - ID : ${props.paper.id}`,
        });
        ActionTicketManager.trackTicket({
          pageType: "paperShow",
          actionType: "fire",
          actionArea: "paperDescription",
          actionTag: "citePaper",
          actionLabel: String(props.paper.id),
        });
      }}
    >
      <div>
        <Icon icon={"CITATION_QUOTE"} className={s.citeIcon} />
        <span>Cite</span>
      </div>
    </div>
  );
};

export default withStyles<typeof CiteBox>(s)(CiteBox);
