import * as React from "react";
import { blockUnverifiedUser, AUTH_LEVEL } from "../../../helpers/checkAuthDialog";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import SearchingPDFBtn from "../../../components/paperShow/components/searchingPDFBtn";
import { getUserGroupName } from "../../../helpers/abTestHelper/index";
import { SIGN_FLOW_AT_PAPER_SHOW_TEST } from "../../../constants/abTestGlobalValue";
const s = require("../actionBar.scss");

const RequestFullTextBtn: React.FunctionComponent<{
  isLoading: boolean;
  paperId: number;
  isOpenBlockedPopper?: boolean;
  handleSetIsOpen: (value: React.SetStateAction<boolean>) => void;
  handleSetIsOpenBlockedPopper?: (value: React.SetStateAction<boolean>) => void;
  btnStyle?: React.CSSProperties;
}> = React.memo(props => {
  const { isLoading, paperId, isOpenBlockedPopper, handleSetIsOpen, btnStyle, handleSetIsOpenBlockedPopper } = props;

  if (isLoading) {
    return <SearchingPDFBtn isLoading={isLoading} />;
  }

  return (
    <button
      style={!!btnStyle ? btnStyle : {}}
      onClick={async () => {
        if (handleSetIsOpenBlockedPopper && getUserGroupName(SIGN_FLOW_AT_PAPER_SHOW_TEST) === "bubble") {
          return handleSetIsOpenBlockedPopper(!isOpenBlockedPopper);
        }

        const isBlocked = await blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: "paperDescription",
          actionLabel: "clickRequestFullTextBtn",
          userActionType: "clickRequestFullTextBtn",
        });

        ActionTicketManager.trackTicket({
          pageType: "paperShow",
          actionType: "fire",
          actionArea: "paperDescription",
          actionTag: "clickRequestFullTextBtn",
          actionLabel: String(paperId),
        });

        if (!isBlocked) {
          handleSetIsOpen(true);
        }
      }}
      className={s.fullTextBtn}
    >
      <Icon icon="SEND" className={s.sendIcon} />
      Request Full-text
    </button>
  );
});

export default withStyles<typeof RequestFullTextBtn>(s)(RequestFullTextBtn);
