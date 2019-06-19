import * as React from 'react';
import { Link } from 'react-router-dom';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperAuthor } from '../../../model/author';
const styles = require('./blockAuthorList.scss');

interface BlockAuthorListProps {
  authors: PaperAuthor[];
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

interface AuthorItemProps {
  author: PaperAuthor;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

const AuthorItem: React.FC<AuthorItemProps> = ({ author, pageType, actionArea }) => {
  let affiliation = null;
  if (author.affiliation) {
    affiliation = <span>{`(${author.affiliation.name})`}</span>;
  }

  let hIndex = null;
  if (author.hindex) {
    <span>{`H-Index: ${author.hindex}`}</span>;
  }

  return (
    <div>
      <Link
        to={`/authors/${author.id}`}
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType,
            actionType: 'fire',
            actionArea: actionArea || pageType,
            actionTag: 'authorShow',
            actionLabel: String(author.id),
          });
        }}
      >
        {author.name}
      </Link>
      {affiliation}
      {hIndex}
    </div>
  );
};

const BlockAuthorList: React.FC<BlockAuthorListProps> = ({ authors, pageType, actionArea }) => {
  return <div />;
};

export default withStyles<typeof BlockAuthorList>(styles)(BlockAuthorList);
