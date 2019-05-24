import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { blockUnverifiedUser, AUTH_LEVEL } from "../../../helpers/checkAuthDialog";
import actionTicketManager from "../../../helpers/actionTicketManager";
const s = require("./blurBlocker.scss");

interface BlurBlockerProps {}

const BlurBlocker: React.FC<BlurBlockerProps> = () => {
  return (
    <div
      onClick={() => {
        actionTicketManager.trackTicket({
          pageType: "paperShow",
          actionArea: "pdfViewer",
          actionTag: "viewMorePDF",
          actionLabel: "viewMorePDF",
          actionType: "fire",
        });

        blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: "pdfViewer",
          actionLabel: "viewMorePDF",
        });
      }}
      className={s.wrapper}
    >
      <div className={s.btnLikeText}>By signing up, view conclusion and full text.</div>
      <div className={s.subText}>Read More</div>
      <Icon icon="DOUBLE_ARROW_DOWN" className={s.arrowIcon} />
    </div>
  );
};

export default withStyles<typeof BlurBlocker>(s)(BlurBlocker);
