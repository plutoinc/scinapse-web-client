import * as React from 'react';
import { Link } from "react-router-dom";
// components
import Icon from '../../icons';

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
            <li className={styles.boldContent}>
              Pluto network
            </li>
            <Link className={styles.normalContent} to="/feature">
              Feature
            </Link>
            <Link className={styles.normalContent} to="/about">
              About us
            </Link>
          </ul>
          <ul className={styles.navbarWrapper}>
            <li className={styles.boldContent}>
              About
            </li>
            <a className={styles.normalContent} href="https://github.com/pluto-net" target="_blank">
              Blog
            </a>
            <Link className={styles.normalContent} to="/faq">
              FAQ
            </Link>
          </ul>
          <div className={styles.iconsWrapper}>
            <div className={styles.boldContent}>
              Follow
            </div>
            <div>
              <a href="https://github.com/pluto-net" target="_blank" className={styles.footerIconWrapper}>
                <Icon icon="FACEBOOK" />
              </a>
              <a href="https://medium.com/pluto-network" target="_blank" className={styles.footerIconWrapper}>
                <Icon icon="MEDIUM" />
              </a>
              <a href="https://twitter.com/pluto_network" target="_blank" className={styles.footerIconWrapper}>
                <Icon icon="TWITTER_COPY" />
              </a>
              <a href="https://medium.com/pluto-network" target="_blank" className={styles.footerIconWrapper}>
                <Icon icon="TELEGRAM" />
              </a>
              <a href="https://github.com/pluto-net" target="_blank" className={styles.footerIconWrapper}>
                <Icon icon="GITHUB" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

}
