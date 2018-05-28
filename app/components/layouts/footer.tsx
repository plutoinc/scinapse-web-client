import * as React from "react";
import { trackAndOpenLink } from "../../helpers/handleGA";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./footer.scss");

interface FooterProps {
  containerStyle?: React.CSSProperties;
}

@withStyles<typeof Footer>(styles)
export default class Footer extends React.PureComponent<FooterProps, {}> {
  public render() {
    const { containerStyle } = this.props;

    const currentYear = new Date().getFullYear();

    return (
      <footer style={containerStyle} className={styles.footerContainer}>
        <div className={styles.title}>
          <div>{`© ${currentYear} Pluto Network. All rights reserved`}</div>
          <small>
            The metadata of papers come from "MS Research", "Semantic Scholar", "PubMed" and "Springer-Nature".
          </small>
        </div>
        <div className={styles.rightBox}>
          <a
            href="https://www.facebook.com/PlutoNetwork/"
            target="_blank"
            onClick={() => {
              trackAndOpenLink("footerAboutUs");
            }}
            className={styles.link}
          >
            Facebook
          </a>
          <a
            href="https://twitter.com/pluto_network"
            target="_blank"
            onClick={() => {
              trackAndOpenLink("footerAboutUs");
            }}
            className={styles.link}
          >
            Twitter
          </a>
          <a
            href="https://medium.com/pluto-network"
            target="_blank"
            onClick={() => {
              trackAndOpenLink("footerAboutUs");
            }}
            className={styles.link}
          >
            Blog
          </a>
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
