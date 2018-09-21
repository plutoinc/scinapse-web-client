import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import EnvChecker from "../../helpers/envChecker";
import Icon from "../../icons";
const styles = require("./topToastBar.scss");

interface TopToastBarProps {
  onClose: () => void;
}

const toastBarHeight = styles.toastBarHeight;

@withStyles<typeof TopToastBar>(styles)
class TopToastBar extends React.PureComponent<TopToastBarProps> {
  public componentDidMount() {
    if (!EnvChecker.isOnServer()) {
      document.body.style.paddingTop = toastBarHeight;
    }
  }

  public componentWillUnmount() {
    if (!EnvChecker.isOnServer()) {
      document.body.style.paddingTop = null;
    }
  }

  public render() {
    const { onClose } = this.props;

    return (
      <div className={styles.topToastWrapper}>
        <div className={styles.container}>
          <span className={styles.content}>Scinapse Grows Everyday 😎</span>
          <a
            href="https://www.notion.so/pluto/Scinapse-updates-6a05160afde44ba1a6ed312899c23dae"
            target="_blank"
            className={styles.updateLinkBtn}
          >
            See What's New
          </a>
        </div>
        <div onClick={onClose} className={styles.iconWrapper}>
          <Icon className={styles.xBtn} icon="X_BUTTON" />
        </div>
      </div>
    );
  }
}

export default TopToastBar;
