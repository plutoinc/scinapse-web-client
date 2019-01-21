import * as React from "react";
import { Link } from "react-router-dom";
import MuiTooltip from "@material-ui/core/Tooltip";
import { MatchEntity } from "../../api/search";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
const styles = require("./authorSearchItem.scss");

interface AuthorSearchItemProps {
  authorEntity: MatchEntity;
}

const AuthorSearchItem: React.SFC<AuthorSearchItemProps> = props => {
  const author = props.authorEntity.entity;

  return (
    <Link to={`authors/${author.id}`} className={styles.itemWrapper}>
      {author.profileImageUrl && (
        <span
          style={{
            backgroundImage: `url(${author.profileImageUrl})`,
          }}
          className={styles.userImg}
        />
      )}
      <span className={styles.nameAffiliationBox}>
        <div className={styles.name}>
          {author.name}{" "}
          {author.isLayered ? (
            <MuiTooltip classes={{ tooltip: styles.verificationTooltip }} title="Verification Author" placement="right">
              <div className={styles.contactIconWrapper}>
                <Icon icon="OCCUPIED" className={styles.occupiedIcon} />
              </div>
            </MuiTooltip>
          ) : null}
        </div>
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
    </Link>
  );
};

export default withStyles<typeof AuthorSearchItem>(styles)(AuthorSearchItem);
