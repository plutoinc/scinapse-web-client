import * as React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import MuiTooltip from '@material-ui/core/Tooltip';
import { withStyles } from '../../helpers/withStylesHelper';
import Icon from '../../icons';
import { Author } from '../../model/author/author';
import { trackActionToClickAuthorEntity } from '../authorSearchItem';
const styles = require('./authorSearchLongItem.scss');

interface AuthorSearchLongItemProps extends RouteComponentProps<any> {
  authorEntity: Author;
}

const AuthorSearchLongItem: React.SFC<AuthorSearchLongItemProps> = props => {
  const author = props.authorEntity;
  const profile = author.profile;
  const href = profile ? `/profiles/${profile.slug}` : `/authors/${author.id}`;

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
      <div className={styles.profileInfoWrapper}>
        {profileImage}
        <span className={styles.nameAffiliationBox}>
          <div className={styles.name}>
            {author.name}{' '}
            {profile ? (
              <MuiTooltip classes={{ tooltip: styles.verificationTooltip }} title="Verified Author" placement="right">
                <div className={styles.contactIconWrapper}>
                  <Icon icon="OCCUPIED" className={styles.occupiedIcon} />
                </div>
              </MuiTooltip>
            ) : null}
          </div>
          <div className={styles.affiliation}>{author.lastKnownAffiliation && author.lastKnownAffiliation.name}</div>
          <div className={styles.fosList}>{fosContent}</div>
        </span>
      </div>
      <div className={styles.metaBox}>
        <span className={styles.metaItem}>
          <div className={styles.metaTitle}>PUBLICATIONS</div>
          <div className={styles.metaContent}>{author.paperCount || '-'}</div>
        </span>
        <span className={styles.metaItem}>
          <div className={styles.metaTitle}>CITATIONS</div>
          <div className={styles.metaContent}>{author.citationCount || '-'}</div>
        </span>
        <span className={styles.metaItem}>
          <div className={styles.metaTitle}>H-INDEX</div>
          <div className={styles.metaContent}>{author.hindex || '-'}</div>
        </span>
      </div>
    </Link>
  );
};

export default withRouter(withStyles<typeof AuthorSearchLongItem>(styles)(AuthorSearchLongItem));
