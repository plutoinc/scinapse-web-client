import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import TransparentButton from '../common/transparentButton';
import { withStyles } from '../../helpers/withStylesHelper';
import { Collection } from '../../model/collection';
import copySelectedTextToClipboard from '../../helpers/copySelectedTextToClipboard';
import ActionTicketManager from '../../helpers/actionTicketManager';
import Icon from '../../icons';
const styles = require('./collectionShareButton.scss');

const FACEBOOK_SHARE_URL = 'http://www.facebook.com/sharer/sharer.php?u=';
const TWITTER_SHARE_URL = 'https://twitter.com/intent/tweet?url=';

function handleActionTicketInShared(platform: string, id: number) {
  ActionTicketManager.trackTicket({
    pageType: 'collectionShow',
    actionType: 'fire',
    actionArea: 'shareBox',
    actionTag: 'collectionSharing',
    actionLabel: `${platform}, ${id}`,
  });
}

function getPageToSharing(platform: string, id: number) {
  switch (platform) {
    case 'COPIED':
      copySelectedTextToClipboard(`https://scinapse.io/collections/${id}?share=copylink`);
      handleActionTicketInShared(platform, id);
      break;
    case 'FACEBOOK':
      window.open(
        `${FACEBOOK_SHARE_URL}https://scinapse.io/collections/${id}?share=facebook`,
        '_blank',
        'width=600, height=400'
      );
      handleActionTicketInShared(platform, id);
      break;
    case 'TWITTER':
      window.open(
        `${TWITTER_SHARE_URL}https://scinapse.io/collections/${id}?share=twitter`,
        '_blank',
        'width=600, height=400'
      );
      handleActionTicketInShared(platform, id);
      break;
    default:
      break;
  }
}

const ShareDropdownContent: React.FC<{ userCollection: Collection }> = ({ userCollection }) => {
  if (!userCollection) return null;

  return (
    <div className={styles.shareAreaWrapper}>
      <span className={styles.shareGuideMessage}>Share this Collection to SNS!</span>
      <div className={styles.shareBtnsWrapper}>
        <a
          className={styles.shareBtn}
          onClick={() => {
            getPageToSharing('COPIED', userCollection.id);
          }}
        >
          <Icon icon="LINK" className={styles.shareIcon} />
        </a>
        <a
          className={styles.shareBtn}
          target="_blank"
          rel="noopener nofollow noreferrer"
          onClick={() => {
            getPageToSharing('FACEBOOK', userCollection.id);
          }}
        >
          <Icon icon="FACEBOOK_LOGO" className={styles.facebookShareIcon} />
        </a>
        <a
          className={styles.shareBtn}
          target="_blank"
          rel="noopener nofollow noreferrer"
          onClick={() => {
            getPageToSharing('TWITTER', userCollection.id);
          }}
        >
          <Icon icon="TWITTER_LOGO" className={styles.twitterShareIcon} />
        </a>
      </div>
    </div>
  );
};

const CollectionShareButton: React.FC<{ userCollection: Collection }> = ({ userCollection }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const collectionShareButton = (
    <TransparentButton
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '93px',
        height: '40px',
        fontWeight: 500,
        padding: '8px',
        marginTop: '32px',
        color: '#3e7fff',
      }}
      iconStyle={{
        marginRight: '8px',
        width: '17px',
        height: '14px',
        color: '#3e7fff',
      }}
      onClick={() => {
        setIsOpen(!isOpen);
      }}
      gaCategory="Collection Show"
      gaAction="Click Share Collection"
      content="Share"
      icon="SHARE"
    />
  );

  return (
    <div className={styles.collectionHeaderBtnWrapper}>
      <ClickAwayListener onClickAway={() => setIsOpen(false)}>
        <div>
          <div>{collectionShareButton}</div>
          <div>{isOpen ? <ShareDropdownContent userCollection={userCollection} /> : null}</div>
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default withStyles<typeof CollectionShareButton>(styles)(CollectionShareButton);