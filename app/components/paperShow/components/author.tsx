import * as React from 'react';
import MuiTooltip from '@material-ui/core/Tooltip';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperAuthor } from '../../../model/author';
import Icon from '../../../icons';
const styles = require('./author.scss');

interface PostAuthorProps {
  author: PaperAuthor;
}

function getOrganization(organization: string) {
  if (!organization) {
    return null;
  } else {
    return <div className={styles.authorAffiliation}>{organization}</div>;
  }
}

const PostAuthor = ({ author }: PostAuthorProps) => {
  return (
    <div className={styles.authorItemWrapper}>
      <div className={styles.authorBasic}>
        <div className={styles.authorName}>
          <span className={styles.name}>
            {author.name}{' '}
            {author.isLayered ? (
              <MuiTooltip
                classes={{ tooltip: styles.verificationTooltip }}
                title="Verified Author"
                placement="right"
              >
                <div className={styles.contactIconWrapper}>
                  <Icon icon="OCCUPIED" className={styles.occupiedIcon} />
                </div>
              </MuiTooltip>
            ) : null}
          </span>
        </div>
        {getOrganization(author.organization)}
      </div>
      {author.hindex ? (
        <div className={styles.authorHindex}>
          <span className={styles.authorHindexLabel}>H-Index: </span>
          <span className={styles.authorHindexValue}>{author.hindex}</span>
        </div>
      ) : null}
    </div>
  );
};

export default withStyles<typeof PostAuthor>(styles)(PostAuthor);
