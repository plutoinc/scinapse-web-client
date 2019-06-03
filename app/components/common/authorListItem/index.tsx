import * as React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '../../../helpers/withStylesHelper';
import HIndexBox from '../hIndexBox';
import { PaperAuthor } from '../../../model/author';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../locationListener';

const styles = require('./authorListItem.scss');

interface AuthorListItemProps {
  author: PaperAuthor;
  handleCloseDialogRequest: () => void;
}

class AuthorListItem extends React.PureComponent<AuthorListItemProps, {}> {
  public render() {
    const { author, handleCloseDialogRequest } = this.props;

    return (
      <div className={styles.itemWrapper}>
        <Link
          to={`/authors/${author.id}`}
          onClick={() => {
            handleCloseDialogRequest();
            ActionTicketManager.trackTicket({
              pageType: getCurrentPageType(),
              actionType: 'fire',
              actionArea: 'authorDialog',
              actionTag: 'authorShow',
              actionLabel: String(author.id),
            });
          }}
        >
          <span className={styles.authorName}>{author.name}</span>
          <span className={styles.affiliation}>{author.affiliation ? author.affiliation.name : ''}</span>
          <span className={styles.hIndexBox}>
            <HIndexBox hIndex={author.hindex} />
          </span>
        </Link>
      </div>
    );
  }
}

export default withStyles<typeof AuthorListItem>(styles)(AuthorListItem);
