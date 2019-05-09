import * as React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import MuiTooltip from "@material-ui/core/Tooltip";
import { MatchEntityAuthor } from "../../api/search";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import { trackEvent } from "../../helpers/handleGA";
import ActionTicketManager from "../../helpers/actionTicketManager";
import { AUTH_LEVEL, blockUnverifiedUser } from "../../helpers/checkAuthDialog";
import { AUTHOR_FROM_SEARCH_TEST_NAME } from "../../constants/abTestGlobalValue";
import { getUserGroupName } from "../../helpers/abTestHelper";
const styles = require("./authorSearchItem.scss");

interface AuthorSearchItemProps extends RouteComponentProps<any> {
  authorEntity: MatchEntityAuthor;
}

export function trackActionToClickAuthorEntity(authorId: number) {
  trackEvent({
    category: "Flow to Author Show",
    action: "Click Author Entity",
    label: `Click Author ID : ${authorId}`,
  });
  ActionTicketManager.trackTicket({
    pageType: "searchResult",
    actionType: "fire",
    actionArea: "authorEntity",
    actionTag: "authorEntityItem",
    actionLabel: String(authorId),
  });
}

const AuthorSearchItem: React.SFC<AuthorSearchItemProps> = props => {
  const author = props.authorEntity;

  const userGroupName: string = getUserGroupName(AUTHOR_FROM_SEARCH_TEST_NAME) || "";

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
      onClick={async e => {
        e.preventDefault();

        const isBlocked =
          userGroupName === "block" &&
          (await blockUnverifiedUser({
            authLevel: AUTH_LEVEL.VERIFIED,
            actionArea: "authorEntity",
            actionLabel: "authorFromSearch",
            userActionType: "authorFromSearch",
          }));

        trackActionToClickAuthorEntity(author.id);

        if (isBlocked) {
          return;
        }

        props.history.push(`/authors/${author.id}`);
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

export default withRouter(withStyles<typeof AuthorSearchItem>(styles)(AuthorSearchItem));
