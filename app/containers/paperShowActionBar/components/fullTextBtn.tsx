import * as React from "react";
import Icon from "../../../icons";
import { blockUnverifiedUser, AUTH_LEVEL } from "../../../helpers/checkAuthDialog";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "../../../helpers/withStylesHelper";
const s = require("../actionBar.scss");

const RequestFullTextBtn: React.FunctionComponent<{
  isLoadingOaCheck: boolean;
  paperId: number;
  handleSetIsOpen: (value: React.SetStateAction<boolean>) => void;
  btnStyle?: React.CSSProperties;
}> = React.memo(props => {
  const { isLoadingOaCheck, paperId, handleSetIsOpen, btnStyle } = props;
  if (isLoadingOaCheck) {
    return (
      <button className={s.loadingBtnStyle} disabled={isLoadingOaCheck}>
        <div className={s.spinnerWrapper}>
          <CircularProgress color="inherit" disableShrink={true} size={14} thickness={4} />
        </div>
        Searching PDF
      </button>
    );
  }

  return (
    <button
      style={!!btnStyle ? btnStyle : {}}
      onClick={async () => {
        const isBlocked = await blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: "paperDescription",
          actionLabel: "clickRequestFullPaper",
        });

        if (!isBlocked) {
          handleSetIsOpen(true);
        }

        ActionTicketManager.trackTicket({
          pageType: "paperShow",
          actionType: "fire",
          actionArea: "paperDescription",
          actionTag: "clickRequestFullTextBtn",
          actionLabel: String(paperId),
        });
      }}
      className={s.fullTextBtn}
    >
      <Icon icon="SEND" className={s.sendIcon} />
      Request Full-text
    </button>
  );
});

export default withStyles<typeof RequestFullTextBtn>(s)(RequestFullTextBtn);
