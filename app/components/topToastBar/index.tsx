import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import { trackEvent } from "../../helpers/handleGA";
const styles = require("./topToastBar.scss");

interface TopToastBarProps {
  onClose: () => void;
}

@withStyles<typeof TopToastBar>(styles)
class TopToastBar extends React.PureComponent<TopToastBarProps> {
  public render() {
    return (
      <div className={styles.topToastWrapper}>
        <div className={styles.container}>
          <span className={styles.content}>Scinapse Grows Everyday 😎</span>
          <a
            href="https://www.notion.so/pluto/Scinapse-Updates-6a05160afde44ba1a6ed312899c23dae"
            target="_blank"
            rel="noopener nofollow noreferrer"
            className={styles.updateLinkBtn}
            onClick={this.trackClickCTAButton}
          >
            See What's New
          </a>
        </div>
        <div onClick={this.handleClickCloseBtn} className={styles.iconWrapper}>
          <Icon className={styles.xBtn} icon="X_BUTTON" />
        </div>
      </div>
    );
  }

  private handleClickCloseBtn = () => {
    const { onClose } = this.props;

    trackEvent({
      category: "Top Toast Action",
      action: "Click Close Button",
    });
    onClose();
  };

  private trackClickCTAButton = () => {
    const { onClose } = this.props;

    trackEvent({
      category: "Top Toast Action",
      action: "Click CTA Button",
    });
    onClose();
  };
}

export default TopToastBar;
