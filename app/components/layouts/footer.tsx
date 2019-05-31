import * as React from 'react';
import { trackAndOpenLink } from '../../helpers/handleGA';
import { withStyles } from '../../helpers/withStylesHelper';
import Dialog from '@material-ui/core/Dialog';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { getCurrentPageType } from '../locationListener';
const styles = require('./footer.scss');

interface FooterProps {
  containerStyle?: React.CSSProperties;
}

const AddBookmarkDialog: React.FunctionComponent<{ isOpen: boolean; onClose: () => void }> = React.memo(props => {
  const { isOpen, onClose } = props;

  return (
    <Dialog open={isOpen} onClose={onClose} classes={{ paper: styles.dialogPaper }}>
      <div className={styles.dialogMainTitle}>Add Scinapse to your Bookmark! 🔖</div>
      <div className={styles.contentBlockDivider} />
      <div className={styles.dialogContentWrapper}>
        <div className={styles.dialogContent}>Enter following keys from your keyboad</div>

        <div className={styles.dialogTitle}>
          Windows{' '}
          <span className={styles.highlightText}>
            <span className={styles.highlightBtnText}>Ctrl</span> + <span className={styles.highlightBtnText}>D</span>
          </span>
        </div>
        <div className={styles.dialogTitle}>
          MAC{' '}
          <span className={styles.highlightText} style={{ marginLeft: '42px' }}>
            <span className={styles.highlightBtnText}>Command</span> +{' '}
            <span className={styles.highlightBtnText}>D</span>
          </span>
        </div>
      </div>
    </Dialog>
  );
});

const Footer: React.FunctionComponent<FooterProps> = props => {
  const { containerStyle } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer style={containerStyle} className={styles.footerContainer}>
      <div className={styles.title}>
        <div>{`© ${currentYear} Pluto Network. All rights reserved`}</div>
      </div>
      <div className={styles.rightBox}>
        <button
          className={styles.tinyButton}
          onClick={() => {
            setIsOpen(true);
            ActionTicketManager.trackTicket({
              pageType: getCurrentPageType(),
              actionType: 'fire',
              actionArea: 'footer',
              actionTag: 'addToBookmark',
              actionLabel: null,
            });
          }}
        >
          <span>Add to Bookmark</span>
        </button>
        <a
          href="https://www.facebook.com/PlutoNetwork/"
          target="_blank"
          rel="noopener nofollow noreferrer"
          onClick={() => {
            trackAndOpenLink('footerAboutUs');
          }}
          className={styles.link}
        >
          Facebook
        </a>
        <a
          href="https://twitter.com/pluto_network"
          target="_blank"
          rel="noopener nofollow noreferrer"
          onClick={() => {
            trackAndOpenLink('footerAboutUs');
          }}
          className={styles.link}
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
          className={styles.link}
        >
          Blog
        </a>
        <a
          href="https://pluto.network"
          target="_blank"
          rel="noopener nofollow noreferrer"
          onClick={() => {
            trackAndOpenLink('footerAboutUs');
          }}
          className={styles.link}
        >
          About us
        </a>
        <a
          href="mailto:team@pluto.network"
          target="_blank"
          rel="noopener nofollow noreferrer"
          onClick={() => {
            trackAndOpenLink('footerContactUs');
          }}
          className={styles.link}
        >
          Contact us
        </a>
        <a
          href="https://www.notion.so/pluto/Frequently-Asked-Questions-4b4af58220aa4e00a4dabd998206325c"
          target="_blank"
          rel="noopener nofollow noreferrer"
          onClick={() => {
            trackAndOpenLink('footerFAQ');
          }}
          className={styles.link}
        >
          FAQ
        </a>
        <a
          href="https://www.notion.so/pluto/Scinapse-Updates-6a05160afde44ba1a6ed312899c23dae"
          target="_blank"
          rel="noopener nofollow noreferrer"
          onClick={() => {
            trackAndOpenLink('Updates');
          }}
          className={styles.link}
        >
          Updates
        </a>
        <a href="https://scinapse.io/terms-of-service" className={styles.termsOfServiceLink}>
          Terms of service
        </a>
        <a href="https://scinapse.io/privacy-policy" className={styles.privacyPolicyLink}>
          Privacy Policy
        </a>
      </div>
      <AddBookmarkDialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </footer>
  );
};

export default withStyles<typeof Footer>(styles)(Footer);
