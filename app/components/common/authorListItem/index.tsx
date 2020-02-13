import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import HIndexBox from '../hIndexBox';
import { PaperAuthor } from '../../../model/author';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../locationListener';
import { PaperProfile } from '../../../model/profile';
const useStyles = require('isomorphic-style-loader/useStyles');
const styles = require('./authorListItem.scss');

interface Props {
  author: PaperAuthor;
  handleCloseDialogRequest: () => void;
  profile?: PaperProfile;
}

const AuthorListItem: FC<Props> = ({ author, profile, handleCloseDialogRequest }) => {
  useStyles(styles);

  return (
    <div className={styles.itemWrapper}>
      <Link
        to={profile && author.order === profile.order ? `/profiles/${profile.slug}` : `/authors/${author.id}`}
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
        <span className={styles.affiliation}>{author.affiliation ? author.affiliation.name : ''}</span>
        <span className={styles.authorName}>{author.name}</span>
        <span className={styles.hIndexBox}>
          <HIndexBox hIndex={author.hindex} />
        </span>
      </Link>
    </div>
  );
};

export default AuthorListItem;
