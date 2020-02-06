import * as React from 'react';
import { Link } from 'react-router-dom';
import MuiTooltip from '@material-ui/core/Tooltip';
import { isEqual } from 'lodash';
import { denormalize } from 'normalizr';
import { useSelector } from 'react-redux';
import { Author, authorSchema } from '../../../model/author/author';
import { trackEvent } from '../../../helpers/handleGA';
import HIndexBox from '../hIndexBox';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { AppState } from '../../../reducers';
const styles = require('./coAuthor.scss');

interface CoAuthorProps {
  authorId: string;
}

const CoAuthor = React.memo(({ authorId }: CoAuthorProps) => {
  const author = useSelector<AppState, Author | undefined>(
    state => denormalize(authorId, authorSchema, state.entities),
    isEqual
  );

  if (!author) return null;

  return (
    <Link
      className={styles.authorItem}
      to={`/authors/${authorId}`}
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
            <MuiTooltip classes={{ tooltip: styles.verificationTooltip }} title="Verified Author" placement="right">
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

export default withStyles<typeof CoAuthor>(styles)(CoAuthor);
