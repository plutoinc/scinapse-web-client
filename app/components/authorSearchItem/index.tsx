import * as React from "react";
import { Link } from "react-router-dom";
import MuiTooltip from "@material-ui/core/Tooltip";
import { MatchEntityAuthor } from "../../api/search";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import { trackEvent } from "../../helpers/handleGA";
import ActionTicketManager from "../../helpers/actionTicketManager";
const styles = require("./authorSearchItem.scss");

interface AuthorSearchItemProps {
  authorEntity: MatchEntityAuthor;
}

const AuthorSearchItem: React.SFC<AuthorSearchItemProps> = props => {
  const author = props.authorEntity;

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
    <Link
      onClick={() => {
        trackEvent({
          category: "Flow to Author Show",
          action: "Click Author Entity",
          label: `Click Author ID : ${author.id}`,
        });
        ActionTicketManager.trackTicket({
          pageType: "searchResult",
          actionType: "fire",
          actionArea: "authorEntity",
          actionTag: "authorEntityItem",
          actionLabel: String(author.id),
        });
      }}
      to={`authors/${author.id}`}
      className={styles.itemWrapper}
    >
      {profileImage}
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
        <div className={styles.fosList}>{fosContent}</div>
      </span>
    </Link>
  );
};

export default withStyles<typeof AuthorSearchItem>(styles)(AuthorSearchItem);
