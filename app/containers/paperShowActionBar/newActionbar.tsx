import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import PdfSourceButton from "../../components/paperShow/components/pdfSourceButton";
import FullTextDialog from "./components/fullTextDialog";
import PaperShowCollectionControlButton from "../paperShowCollectionControlButton";
import ActionTicketManager from "../../helpers/actionTicketManager";
import CiteBox from "./components/citeBox";
import { Paper } from "../../model/paper";
import Icon from "../../icons";
import { getPDFLink } from "../../helpers/getPDFLink";
const s = require("./actionBar.scss");

interface PaperShowActionBarProps {
  paper: Paper | null;
}

const PaperShowActionBar: React.FunctionComponent<PaperShowActionBarProps> = props => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!props.paper) return null;

  const pdfSource = getPDFLink(props.paper.urls);
  const hasSource = props.paper.urls.length > 0;

  return (
    <div className={s.actionBar}>
      <div className={s.actions}>
        <div className={s.leftSide}>
          {hasSource && (
            <div className={s.actionItem}>
              <PdfSourceButton paper={props.paper} fullTextAB="B" reverseColor />
            </div>
          )}
          {!pdfSource && (
            <div className={s.actionItem}>
              <button
                onClick={() => {
                  ActionTicketManager.trackTicket({
                    pageType: "paperShow",
                    actionType: "fire",
                    actionArea: "paperDescription",
                    actionTag: "clickRequestFullTextBtn",
                    actionLabel: String(props.paper!.id),
                    expName: "requestFullText",
                    expUser: "B",
                  });
                  setIsOpen(true);
                }}
                className={s.fullTextBtn}
              >
                <Icon icon="SEND" className={s.sendIcon} />
                Request Full-text
              </button>
            </div>
          )}
          <div className={s.actionItem}>
            <CiteBox paper={props.paper} fullTextAB="B" />
          </div>
          <FullTextDialog
            paperId={props.paper.id}
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
            }}
            fullTextAB="B"
          />
        </div>
        <div className={s.rightSide}>
          <PaperShowCollectionControlButton isTestVersion />
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof PaperShowActionBar>(s)(PaperShowActionBar);
