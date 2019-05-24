import * as React from "react";
import Popper, { PopperProps } from "@material-ui/core/Popper";
import { withStyles } from "../../helpers/withStylesHelper";
import { getCurrentPageType } from "../locationListener";
import ActionTicketManager from "../../helpers/actionTicketManager/index";
const styles = require("./suddenAlert.scss");

interface SuddenAlertProps extends PopperProps {}

const SuddenAlert: React.FC<SuddenAlertProps> = props => {
  const [shouldShowSuddenAlert, setShouldShowSuddenAlert] = React.useState(false);

  React.useEffect(
    () => {
      const showSuddenAlertTimeout = setTimeout(() => {
        if (props.open) {
          setShouldShowSuddenAlert(true);

          ActionTicketManager.trackTicket({
            pageType: getCurrentPageType(),
            actionType: "view",
            actionArea: "topBar",
            actionTag: "alertView",
            actionLabel: "suddenAlert",
          });
        }
      }, 5000);

      return () => {
        clearTimeout(showSuddenAlertTimeout);
      };
    },
    [props.open]
  );

  const popperProps: SuddenAlertProps = {
    ...props,
    open: props.open && shouldShowSuddenAlert,
    modifiers: { flip: { enabled: false } },
  };

  return (
    <Popper {...popperProps} style={{ zIndex: 9999 }}>
      <div className={`${styles.speechBubble} ${props.className}`}>
        <div className={styles.contentWrapper}>
          <div className={styles.title}>You are not signed on Scinapse.</div>
          <div className={styles.subText}>When you join Scinapse, you can…</div>
          <div className={styles.mainText}>
            <ul>
              <li>search unlimitedly PDF</li>
              <li>download & request Full-text</li>
              <li>save to Collection</li>
            </ul>
          </div>
          <div className={styles.okBtnWrapper}>
            <button
              className={styles.okBtn}
              onClick={() => {
                setShouldShowSuddenAlert(false);
                ActionTicketManager.trackTicket({
                  pageType: getCurrentPageType(),
                  actionType: "fire",
                  actionArea: "topBar",
                  actionTag: "clickOk",
                  actionLabel: "suddenAlert",
                });
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </Popper>
  );
};

export default withStyles<typeof styles>(styles)(SuddenAlert);
