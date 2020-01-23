import React from 'react';
import { Link } from 'react-router-dom';
import { Paper } from '../../../model/paper';
import { PaperAuthor } from '../../../model/author';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./mobileAuthors.scss');

interface MobileAuthorsProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  isExpanded: boolean;
}

const SimpleAuthorItem: React.FC<{ author: PaperAuthor }> = ({ author }) => {
  return (
    <Link style={{ textDecoration: 'underline' }} to={`/authors/${author.id}`}>
      {author.name}
    </Link>
  );
};

const BlockAuthorItem: React.FC<{ author: PaperAuthor }> = ({ author }) => {
  let affiliation = null;
  if (author.affiliation) {
    if (author.affiliation.nameAbbrev) {
      affiliation = `${author.affiliation.nameAbbrev}: ${author.affiliation.name}`;
    }
    affiliation = author.affiliation.name;
  }

  return (
    <Link to={`/authors/${author.id}`} className={s.blockAuthorItem}>
      <div className={s.leftBox}>
        <div className={s.authorName}>{author.name}</div>
        {author.affiliation && <div className={s.affiliation}>{affiliation}</div>}
      </div>
      <div className={s.rightBox}>{author.hindex && `H-Index: ${author.hindex}`}</div>
    </Link>
  );
};

const MobileAuthors: React.FC<MobileAuthorsProps> = ({ isExpanded, paper }) => {
  useStyles(s);
  if (!paper.authors || paper.authors.length === 0) return null;

  if (isExpanded) {
    let authorCount = <div className={s.authorCount} />;

    if (paper.authorCount > 3) {
      authorCount = <div className={s.authorCount}>{`+ ${paper.authorCount - 3} Authors`}</div>;
    } else if (paper.authorCount === 0 && paper.authors.length > 3) {
      authorCount = <div className={s.authorCount}>{`+ ${paper.authors.length - 3} Authors`}</div>;
    }

    const authorList = paper.authors.slice(0, 2).map(author => <BlockAuthorItem author={author} key={author.id} />);
    if (paper.authors.length > 3) {
      authorList.push(
        <BlockAuthorItem
          author={paper.authors[paper.authors.length - 1]}
          key={paper.authors[paper.authors.length - 1].id}
        />
      );
    }

    return (
      <div className={s.blockAuthorList}>
        {authorList}
        {authorCount}
      </div>
    );
  }

  let authorCount = `${paper.authorCount} Authors`;

  if (paper.authorCount === 1) {
    authorCount = '1 Author';
  } else if (paper.authorCount === 0) {
    authorCount = `${paper.authors.length} Authors`;
  }

  let authorList = (
    <span>
      {'('}
      <SimpleAuthorItem author={paper.authors[0]} />
      {`, ..., `}
      <SimpleAuthorItem author={paper.authors[paper.authors.length - 1]} />
      {')'}
    </span>
  );
  if (paper.authors.length < 3) {
    authorList = (
      <span>
        {'('}
        {paper.authors.map((author, i) => (
          <>
            <SimpleAuthorItem key={author.id} author={author} />
            {i !== paper.authors.length - 1 && ', '}
          </>
        ))}
        {')'}
      </span>
    );
  }

  return (
    <div className={s.oneLineAuthors}>
      <span>{authorCount}</span> {authorList}
    </div>
  );
};

export default MobileAuthors;
