import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { trackAndOpenLink } from '../../helpers/handleGA';
import { withStyles } from '../../helpers/withStylesHelper';
import Icon from '../../icons';
const styles = require('./improvedFooter.scss');

interface FooterProps {
  containerStyle?: React.CSSProperties;
}

const ImprovedFooter: React.FC<FooterProps> = props => {
  const { containerStyle } = props;
  const currentYear = new Date().getFullYear();

  const [isSourceOpen, setIsSourceOpen] = React.useState(false);

  return (
    <div className={styles.footerWrapper} style={containerStyle}>
      <footer className={styles.footerContainer}>
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
              <div
                onClick={() => {
                  setIsSourceOpen(true);
                }}
                className={styles.menuItem}
              >
                Data Sources
              </div>
              <Dialog
                open={isSourceOpen}
                onClose={() => {
                  setIsSourceOpen(false);
                }}
                classes={{
                  paper: styles.dialogPaper,
                }}
                maxWidth="lg"
              >
                <div className={styles.sourceVendorWrapper}>
                  <div className={styles.sourceVendorItem}>
                    <a href="https://aka.ms/msracad" target="_blank" rel="noopener nofollow noreferrer">
                      <picture>
                        <source srcSet="https://assets.pluto.network/scinapse/ms-research.webp" type="image/webp" />
                        <source srcSet="https://assets.pluto.network/scinapse/ms-research.jpg" type="image/jpeg" />
                        <img src="https://assets.pluto.network/scinapse/ms-research.jpg" alt="circle" />
                      </picture>
                    </a>
                  </div>
                  <div className={styles.sourceVendorItem}>
                    <a href="https://www.semanticscholar.org/" target="_blank" rel="noopener nofollow noreferrer">
                      <picture>
                        <source
                          srcSet="https://assets.pluto.network/scinapse/semantic-scholar.webp"
                          type="image/webp"
                        />
                        <source srcSet="https://assets.pluto.network/scinapse/semantic-scholar.jpg" type="image/jpeg" />
                        <img src="https://assets.pluto.network/scinapse/semantic-scholar.jpg" alt="circle" />
                      </picture>
                    </a>
                  </div>
                  <div className={styles.sourceVendorItem}>
                    <a href="https://www.springernature.com/gp/" target="_blank" rel="noopener nofollow noreferrer">
                      <picture>
                        <source srcSet="https://assets.pluto.network/scinapse/springer-nature.webp" type="image/webp" />
                        <source srcSet="https://assets.pluto.network/scinapse/springer-nature.jpg" type="image/jpeg" />
                        <img src="https://assets.pluto.network/scinapse/springer-nature.jpg" alt="circle" />
                      </picture>
                    </a>
                  </div>
                  <div className={styles.sourceVendorItem}>
                    <a href="https://www.ncbi.nlm.nih.gov/pubmed/" target="_blank" rel="noopener nofollow noreferrer">
                      <picture>
                        <source srcSet="https://assets.pluto.network/scinapse/pub-med.webp" type="image/webp" />
                        <source srcSet="https://assets.pluto.network/scinapse/pub-med.jpg" type="image/jpeg" />
                        <img src="https://assets.pluto.network/scinapse/pub-med.jpg" alt="circle" />
                      </picture>
                    </a>
                  </div>
                </div>
              </Dialog>
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
          <div>{`© ${currentYear} Pluto Inc. All rights reserved`}</div>
        </div>
      </footer>
    </div>
  );
};

export default withStyles<typeof ImprovedFooter>(styles)(ImprovedFooter);
