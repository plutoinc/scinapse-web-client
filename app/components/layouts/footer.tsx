import * as React from 'react';
// import { Link } from "react-router-dom";
// components
import Icon from '../../icons';

const styles = require("./footer.scss");

export default class Footer extends React.PureComponent<null, null> {
  public render() {
    return (
      <footer className={styles.footer}>
        <div className={styles.innerContainer}>
          <div className={styles.copyRight}>
            ©Pluto. All Rights Reserved<br />
            team@pluto.network
          </div>
          <div className={styles.iconsWrapper}>
            <a href="https://github.com/pluto-net" target="_blank" className={styles.footerIconWrapper}>
              <Icon icon="GITHUB" />
            </a>
            {/* <a href="/" className={styles.footerIconWrapper}>
              <Icon icon="REDDIT" />
            </a> */}
            <a href="https://twitter.com/pluto_network" target="_blank" className={styles.footerIconWrapper}>
              <Icon icon="TWITTER" />
            </a>
            <a href="https://medium.com/pluto-network" target="_blank" className={styles.footerIconWrapper}>
              <Icon icon="MEDIUM" />
            </a>
          </div>
        </div>
      </footer>
    );
  }

}
