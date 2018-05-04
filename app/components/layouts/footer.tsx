import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./footer.scss");

interface FooterProps {
  containerStyle?: React.CSSProperties;
}

@withStyles<typeof Footer>(styles)
export default class Footer extends React.PureComponent<FooterProps, null> {
  public render() {
    const { containerStyle } = this.props;

    const currentYear = new Date().getFullYear();

    return (
      <footer style={containerStyle} className={styles.footerContainer}>
        <div className={styles.title}>{`© ${currentYear} Pluto Network. All rights reserved`}</div>
        <div className={styles.rightBox}>
          <a href="https://www.facebook.com/PlutoNetwork/" target="_blank" className={styles.link}>
            Facebook
          </a>
          <a href="https://twitter.com/pluto_network" target="_blank" className={styles.link}>
            Twitter
          </a>
          <a href="https://medium.com/pluto-network" target="_blank" className={styles.link}>
            Blog
          </a>
          <a href="https://pluto.network" target="_blank" className={styles.link}>
            About us
          </a>
          <a href="mailto:team@pluto.network" target="_blank" className={styles.link}>
            Contact us
          </a>
        </div>
      </footer>
    );
  }
}
