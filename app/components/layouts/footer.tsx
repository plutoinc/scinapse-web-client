import * as React from "react";
import { Link } from "react-router-dom";
// components
import Icon from "../../icons";
import { trackAndOpenLink, trackAction } from "../../helpers/handleGA";

const styles = require("./footer.scss");

export default class Footer extends React.PureComponent<null, null> {
  public render() {
    return (
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.copyRightWrapper}>
            <Icon className={styles.footerLogo} icon="FOOTER_LOGO" />
            <div className={styles.copyRightContent}>
              Copyright © 2017 Pluto Network.<br />
              All rights reserved.
            </div>
          </div>
          <ul className={styles.navbarWrapper}>
            <li className={styles.boldContent}>Pluto network</li>
            <Link to="/feature" onClick={() => trackAction("/feature", "Footer")} className={styles.normalContent}>
              Feature
            </Link>
            <a
              onClick={() =>
                trackAndOpenLink(
                  "https://medium.com/pluto-network/introducing-plutos-proof-of-concept-prototype-41c4b871861b",
                  "Footer",
                )}
              className={styles.normalContent}
            >
              About us
            </a>
          </ul>
          <ul className={styles.navbarWrapper}>
            <li className={styles.boldContent}>About</li>
            <a
              onClick={() => {
                trackAndOpenLink("https://medium.com/pluto-network", "Footer");
              }}
              className={styles.normalContent}
            >
              Blog
            </a>
            <Link to="/faq" onClick={() => trackAction("faq", "Footer")} className={styles.normalContent}>
              FAQ
            </Link>
          </ul>
          <div className={styles.iconsWrapper}>
            <div className={styles.boldContent}>Follow</div>
            <div>
              <a
                onClick={() => {
                  trackAndOpenLink("https://www.facebook.com/Pluto-263226227503100/", "Footer");
                }}
                className={styles.footerIconWrapper}
              >
                <Icon icon="FACEBOOK" />
              </a>
              <a
                onClick={() => {
                  trackAndOpenLink("https://medium.com/pluto-network", "Footer");
                }}
                className={styles.footerIconWrapper}
              >
                <Icon icon="MEDIUM" />
              </a>
              <a
                onClick={() => {
                  trackAndOpenLink("https://twitter.com/pluto_network", "Footer");
                }}
                className={styles.footerIconWrapper}
              >
                <Icon icon="TWITTER_COPY" />
              </a>
              <a
                onClick={() => {
                  trackAndOpenLink("https://t.me/plutonetwork", "Footer");
                }}
                className={styles.footerIconWrapper}
              >
                <Icon icon="TELEGRAM" />
              </a>
              <a
                onClick={() => {
                  trackAndOpenLink("https://github.com/pluto-net", "Footer");
                }}
                className={styles.footerIconWrapper}
              >
                <Icon icon="GITHUB" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
