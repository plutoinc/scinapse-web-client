import * as React from "react";

// components
import { trackAndOpenLink } from "../../helpers/handleGA";

const styles = require("./footer.scss");

export default class Footer extends React.PureComponent<null, null> {
  public render() {
    return (
      <footer className={styles.footerContainer}>
        <div className={styles.title}>© 2017 Pluto Nerwork. All rights reserved</div>
        <div className={styles.rightBox}>
          <a
            onClick={() => {
              trackAndOpenLink("https://pluto.network", "footer");
            }}
            className={styles.link}
          >
            About us
          </a>
          <a
            onClick={() => {
              trackAndOpenLink("mailto:team@pluto.network", "footer");
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
