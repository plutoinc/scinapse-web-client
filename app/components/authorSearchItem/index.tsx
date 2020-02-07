import * as React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import MuiTooltip from '@material-ui/core/Tooltip';
import { MatchEntityAuthor } from '../../api/search';
import { withStyles } from '../../helpers/withStylesHelper';
import Icon from '../../icons';
import ActionTicketManager from '../../helpers/actionTicketManager';
const styles = require('./authorSearchItem.scss');

interface AuthorSearchItemProps extends RouteComponentProps<any> {
  authorEntity: MatchEntityAuthor;
}

export function trackActionToClickAuthorEntity(authorId: string) {
  ActionTicketManager.trackTicket({
    pageType: 'searchResult',
    actionType: 'fire',
    actionArea: 'authorEntity',
    actionTag: 'authorEntityItem',
    actionLabel: String(authorId),
  });
}

const AuthorSearchItem: React.FC<AuthorSearchItemProps> = props => {
  const author = props.authorEntity;
  const profile = author.profile;
  const href = profile ? `/profiles/${profile.id}` : `/authors/${author.id}`;

  const profileImage = author.profileImageUrl ? (
    <span
      style={{
        backgroundImage: `url(${author.profileImageUrl})`,
      }}
      className={styles.userImg}
    />
  ) : (
    <Icon className={styles.userImg} icon="DEFAULT_PROFILE_IMAGE" />
  );

  const fosContent = author.fosList.slice(0, 3).map((fos, index) => {
    return index === 0 ? fos.name : ` · ${fos.name}`;
  });

  return (
    <Link onClick={() => trackActionToClickAuthorEntity(author.id)} to={href} className={styles.itemWrapper}>
      {profileImage}
      <span className={styles.nameAffiliationBox}>
        <div className={styles.name}>
          {author.name}{' '}
          {author.profile && (
            <MuiTooltip classes={{ tooltip: styles.verificationTooltip }} title="Verified Author" placement="right">
              <div className={styles.contactIconWrapper}>
                <Icon icon="OCCUPIED" className={styles.occupiedIcon} />
              </div>
            </MuiTooltip>
          )}
        </div>
        <div className={styles.affiliation}>{author.lastKnownAffiliation && author.lastKnownAffiliation.name}</div>
        <div className={styles.fosList}>{fosContent}</div>
      </span>
    </Link>
  );
};

export default withRouter(withStyles<typeof AuthorSearchItem>(styles)(AuthorSearchItem));
