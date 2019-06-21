import * as React from 'react';
import { trackAndOpenLink } from '../../helpers/handleGA';
import { withStyles } from '../../helpers/withStylesHelper';
import Icon from '../../icons';
const styles = require('./improvedFooter.scss');

interface FooterProps {
  containerStyle?: React.CSSProperties;
}

const ImprovedFooter: React.FunctionComponent<FooterProps> = props => {
  const { containerStyle } = props;
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.footerWrapper} style={containerStyle}>
      <footer style={containerStyle} className={styles.footerContainer}>
        <div className={styles.scinapseInfoWrapper}>
          <div className={styles.scinapseInfo}>
            <div className={styles.scinapseLogo}>
              <Icon icon="SCINAPSE_IMPROVEMENT_LOGO" className={styles.logoIcon} />
              <span className={styles.logoContext}>Academic Search Engine</span>
            </div>
          </div>
          <div className={styles.rightBox}>
            <div className={styles.menu}>
              <div className={styles.menuTitle}>About</div>
              <a
                href="https://pluto.network"
                target="_blank"
                rel="noopener nofollow noreferrer"
                onClick={() => {
                  trackAndOpenLink('footerAboutUs');
                }}
                className={styles.menuItem}
              >
                About us
              </a>
              <a
                href="https://www.notion.so/pluto/Frequently-Asked-Questions-4b4af58220aa4e00a4dabd998206325c"
                target="_blank"
                rel="noopener nofollow noreferrer"
                onClick={() => {
                  trackAndOpenLink('footerFAQ');
                }}
                className={styles.menuItem}
              >
                FAQ
              </a>
            </div>
            <div className={styles.menu}>
              <div className={styles.menuTitle}>Updates</div>
              <a
                href="https://twitter.com/pluto_network"
                target="_blank"
                rel="noopener nofollow noreferrer"
                onClick={() => {
                  trackAndOpenLink('footerAboutUs');
                }}
                className={styles.menuItem}
              >
                Twitter
              </a>
              <a
                href="https://medium.com/pluto-network"
                target="_blank"
                rel="noopener nofollow noreferrer"
                onClick={() => {
                  trackAndOpenLink('footerAboutUs');
                }}
                className={styles.menuItem}
              >
                Blog
              </a>
              <a
                href="https://www.facebook.com/PlutoNetwork/"
                target="_blank"
                rel="noopener nofollow noreferrer"
                onClick={() => {
                  trackAndOpenLink('footerAboutUs');
                }}
                className={styles.menuItem}
              >
                Facebook
              </a>
            </div>
            <div className={styles.menu}>
              <div className={styles.menuTitle}>Terms</div>
              <a href="https://scinapse.io/terms-of-service" className={styles.menuItem}>
                Terms of service
              </a>
              <a href="https://scinapse.io/privacy-policy" className={styles.menuItem}>
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
        <div className={styles.title}>
          <div>{`© ${currentYear} Pluto Network. All rights reserved`}</div>
        </div>
      </footer>
    </div>
  );
};

export default withStyles<typeof ImprovedFooter>(styles)(ImprovedFooter);
