import * as React from "react";
import Popper, { PopperProps } from "@material-ui/core/Popper";
import { withStyles } from "../../helpers/withStylesHelper";
import { useIntervalProgress } from "../../hooks/useIntervalProgressHook";
const styles = require("./suddenAlert.scss");

interface SuddenAlertProps extends PopperProps {}

const SuddenAlert: React.FC<SuddenAlertProps> = props => {
  const [renderTime, setRenderTime] = React.useState(0);
  const [shouldShowSuddenAlert, setShouldShowSuddenAlert] = React.useState(false);

  useIntervalProgress(() => {
    setRenderTime(renderTime + 1);
    if (renderTime === 4) {
      setShouldShowSuddenAlert(true);
    }
  }, renderTime < 5 ? 1000 : null);

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