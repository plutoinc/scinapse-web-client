import * as React from 'react';
import { Link } from 'react-router-dom';
import MuiTooltip from '@material-ui/core/Tooltip';
import { Author } from '../../../model/author/author';
import { trackEvent } from '../../../helpers/handleGA';
import HIndexBox from '../hIndexBox';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import ActionTicketManager from '../../../helpers/actionTicketManager';
const styles = require('./profileCoAuthor.scss');

interface ProfileCoAuthorProps {
  author: Author;
}

const ProfileCoAuthor = React.memo(({ author }: ProfileCoAuthorProps) => {
  if (!author) return null;

  return (
    <Link
      className={styles.authorItem}
      to={`/authors/${author.id}`}
      onClick={() => {
        trackEvent({
          category: 'Flow to Author Show',
          action: 'Click Co-Author',
          label: 'Author Show',
        });
        ActionTicketManager.trackTicket({
          pageType: 'authorShow',
          actionType: 'fire',
          actionArea: 'coAuthor',
          actionTag: 'authorShow',
          actionLabel: String(author.id),
        });
      }}
    >
      <div className={styles.coAuthorItemHeader}>
        <div className={styles.coAuthorName}>
          {author.name}{' '}
          {author.isLayered ? (
            <MuiTooltip classes={{ tooltip: styles.verificationTooltip }} title="Verification Author" placement="right">
              <div className={styles.contactIconWrapper}>
                <Icon icon="OCCUPIED" className={styles.occupiedIcon} />
              </div>
            </MuiTooltip>
          ) : null}
        </div>
        <div className={styles.hIndexWrapper}>
          <HIndexBox hIndex={author.hindex} />
        </div>
      </div>
      <span className={styles.coAuthorAffiliation}>
        {author.lastKnownAffiliation ? author.lastKnownAffiliation.name : ''}
      </span>
    </Link>
  );
});

export default withStyles<typeof ProfileCoAuthor>(styles)(ProfileCoAuthor);
