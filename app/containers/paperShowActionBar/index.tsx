import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import FullTextDialog from "./components/fullTextDialog";
import PaperShowCollectionControlButton from "../paperShowCollectionControlButton";
import ActionTicketManager from "../../helpers/actionTicketManager";
import CiteBox from "./components/citeBox";
import { Paper } from "../../model/paper";
import Icon from "../../icons";
import { getPDFLink } from "../../helpers/getPDFLink";
import { CurrentUser } from "../../model/currentUser";
import { blockUnverifiedUser, AUTH_LEVEL } from "../../helpers/checkAuthDialog";
import SourceButton from "../../components/paperShow/components/sourceButton";
import ViewFullTextBtn from "../../components/paperShow/components/viewFullTextBtn";
const s = require("./actionBar.scss");

interface PaperShowActionBarProps {
  paper: Paper | null;
  showFullText: boolean;
  currentUser: CurrentUser;
  handleClickFullText: () => void;
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
          {!pdfSource ? (
            <div className={s.actionItem}>
              <button
                onClick={async () => {
                  const isBlocked = await blockUnverifiedUser({
                    authLevel: AUTH_LEVEL.VERIFIED,
                    actionArea: "paperDescription",
                    actionLabel: "clickRequestFullPaper",
                  });

                  if (!isBlocked) {
                    setIsOpen(true);
                  }

                  ActionTicketManager.trackTicket({
                    pageType: "paperShow",
                    actionType: "fire",
                    actionArea: "paperDescription",
                    actionTag: "clickRequestFullTextBtn",
                    actionLabel: String(props.paper!.id),
                  });
                }}
                className={s.fullTextBtn}
              >
                <Icon icon="SEND" className={s.sendIcon} />
                Request Full-text
              </button>
            </div>
          ) : (
            <div className={s.actionItem}>
              <ViewFullTextBtn handleClickFullText={props.handleClickFullText} />
            </div>
          )}
          {hasSource && (
            <div className={s.actionItem}>
              <SourceButton paper={props.paper} showFullText={!!pdfSource} />
            </div>
          )}
          <div className={s.actionItem}>
            <CiteBox paper={props.paper} />
          </div>
          <FullTextDialog
            paperId={props.paper.id}
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
            }}
          />
        </div>
        <div className={s.rightSide}>
          <PaperShowCollectionControlButton />
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof PaperShowActionBar>(s)(PaperShowActionBar);
