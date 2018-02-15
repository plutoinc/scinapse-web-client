import * as React from "react";
import { trackAndOpenLink } from "../../helpers/handleGA";

const styles = require("./footer.scss");

interface FooterProps {
  containerStyle?: React.CSSProperties;
}

export default class Footer extends React.PureComponent<FooterProps, null> {
  public render() {
    const { containerStyle } = this.props;

    return (
      <footer style={containerStyle} className={styles.footerContainer}>
        <div className={styles.title}>© 2017 Pluto Network. All rights reserved</div>
        <div className={styles.rightBox}>
          <a
            href="https://pluto.network"
            target="_blank"
            onClick={() => {
              trackAndOpenLink("footerAboutUs");
            }}
            className={styles.link}
          >
            About us
          </a>
          <a
            href="mailto:team@pluto.network"
            target="_blank"
            onClick={() => {
              trackAndOpenLink("footerContactUs");
            }}
            className={styles.link}
          >
            Contact us
          </a>
        </div>
      </footer>
    );
  }
}
