import * as React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../icons";
import { Affiliation } from "../../../model/affiliation";
import { AuthorSectionProps, TrackingProps } from "../types";
import { withStyles } from "../../../helpers/withStylesHelper";
import ActionTicketManager from "../../../helpers/actionTicketManager";
const s = require("./authors.scss");

const MAX_AUTHOR_COUNT_TO_SHOW = 2;

const Organization: React.FC<{ affiliation: Affiliation }> = ({ affiliation }) => {
  if (!!affiliation) {
    const trimmedOrganization = affiliation.name
      .split(",")
      .slice(0, 2)
      .join();

    return <span>{` (${trimmedOrganization})`}</span>;
  }
  return null;
};

const HIndex: React.FC<{ hIndex: number }> = ({ hIndex }) => {
  if (!!hIndex) {
    return (
      <span className={s.authorHIndex}>
        <span className={s.hIndexChar}>{hIndex}</span>
        <div className={s.detailHIndexBox}>
          <div className={s.contentWrapper}>{`Estimated H-index: ${hIndex}`}</div>
        </div>
      </span>
    );
  }
  return null;
};

const LeftAuthorInfo: React.FC<{ authorCount: number }> = ({ authorCount }) => {
  const hasMoreAuthor = authorCount > MAX_AUTHOR_COUNT_TO_SHOW;

  if (hasMoreAuthor) {
    return <span>{`...(${authorCount - MAX_AUTHOR_COUNT_TO_SHOW} more)`}</span>;
  }
  return null;
};

const AuthorSection: React.FC<AuthorSectionProps & TrackingProps> = props => {
  const { paper, pageType, actionArea } = props;

  if (paper.authors && paper.authors.length > 0) {
    const authorsToShow = paper.authors.slice(0, MAX_AUTHOR_COUNT_TO_SHOW);
    const content = authorsToShow.map((author, index) => {
      const withoutComma = index + 1 === MAX_AUTHOR_COUNT_TO_SHOW && paper.authorCount <= MAX_AUTHOR_COUNT_TO_SHOW;
      return (
        <span key={author.id} className={s.authorItem}>
          <Link
            onClick={() => {
              ActionTicketManager.trackTicket({
                pageType,
                actionType: "fire",
                actionArea: actionArea || pageType,
                actionTag: "authorShow",
                actionLabel: String(author.id),
              });
            }}
            className={s.authorLink}
            to={`/authors/${author.id}`}
          >
            {author.name}
          </Link>
          <HIndex hIndex={author.hindex} />
          <Organization affiliation={author.affiliation} />
          {!withoutComma && <span>{`, `}</span>}
        </span>
      );
    });

    return (
      <div className={s.authorSectionWrapper}>
        <Icon icon="AUTHOR" />
        {content}
        <LeftAuthorInfo authorCount={paper.authorCount} />
      </div>
    );
  }
  return null;
};

export default withStyles<typeof AuthorSection>(s)(AuthorSection);
