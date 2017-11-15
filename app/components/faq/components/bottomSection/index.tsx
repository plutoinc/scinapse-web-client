import * as React from "react";
const VisibilitySensor = require("react-visibility-sensor");

// styles
import Icon from "../../../../icons";
const styles = require("./bottomSection.scss");

interface IBottomSectionProps {}
interface IBottomSectionStates {
  shown: boolean;
}

class BottomSection extends React.PureComponent<IBottomSectionProps, IBottomSectionStates> {
  constructor(props: IBottomSectionProps) {
    super(props);

    this.state = {
      shown: false,
    };
  }

  private checkVisibility = (isVisible: boolean) => {
    if (isVisible) {
      this.setState({ shown: true });
    }
  };

  public render() {
    return (
      <section className={styles.bottomSectionContainer}>
        <VisibilitySensor partialVisibility onChange={this.checkVisibility}>
          <div className={`${styles.innerContainer} ${this.state.shown ? styles.shown : ""}`}>
            <div className={styles.balloonWrapper}>
              <Icon className={styles.balloonIcon} icon="FAQ_BALLOON" />
              <p className={styles.balloonText}>Can`t find what you`re looking for?</p>
            </div>
            <div className={styles.balloonWrapper}>
              <Icon className={styles.balloonIcon} icon="FAQ_BALLOON" />
              <p className={styles.balloonText}>Join our Telegram and ask freely!</p>
            </div>
            <a href="https://t.me/plutonetwork" className={styles.telegramLink}>
              <Icon icon="TELEGRAM_ICON" />
              Join Pluto Telegram
            </a>
          </div>
        </VisibilitySensor>
      </section>
    );
  }
}

export default BottomSection;
