import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Paper } from "../../../model/paper";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import Icon from "../../../icons";
const s = require("./citeBox.scss");

interface CiteBoxProps {
  paper: Paper;
  actionArea: string;
  btnStyle?: React.CSSProperties;
}

const CiteBox: React.FunctionComponent<CiteBoxProps> = props => {
  if (!props.paper.doi) return null;
  return (
    <div
      style={!!props.btnStyle ? props.btnStyle : {}}
      className={s.citeButton}
      onClick={() => {
        GlobalDialogManager.openCitationDialog(props.paper.id);
        ActionTicketManager.trackTicket({
          pageType: "paperShow",
          actionType: "fire",
          actionArea: props.actionArea,
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
