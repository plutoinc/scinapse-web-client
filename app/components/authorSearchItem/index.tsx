import * as React from "react";
import { MatchEntity } from "../../api/search";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./authorSearchItem.scss");

interface AuthorSearchItemProps {
  authorEntity: MatchEntity;
}

const AuthorSearchItem: React.SFC<AuthorSearchItemProps> = props => {
  const author = props.authorEntity.entity;
  return (
    <div className={styles.itemWrapper}>
      {author.profileImageUrl && (
        <span
          style={{
            backgroundImage: `url(${author.profileImageUrl})`,
          }}
          className={styles.userImg}
        />
      )}
      <span className={styles.nameAffiliationBox}>
        <div className={styles.name}>{author.name}</div>
        <div className={styles.affiliation}>{author.lastKnownAffiliation && author.lastKnownAffiliation.name}</div>
      </span>
      <div className={styles.metaBox}>
        <span className={styles.metaItem}>
          <div className={styles.metaTitle}>PUBLICATIONS</div>
          <div className={styles.metaContent}>{author.paperCount || "-"}</div>
        </span>
        <span className={styles.metaItem}>
          <div className={styles.metaTitle}>CITATIONS</div>
          <div className={styles.metaContent}>{author.citationCount || "-"}</div>
        </span>
        <span className={styles.metaItem}>
          <div className={styles.metaTitle}>H-INDEX</div>
          <div className={styles.metaContent}>{author.hindex || "-"}</div>
        </span>
      </div>
    </div>
  );
};

export default withStyles<typeof AuthorSearchItem>(styles)(AuthorSearchItem);
