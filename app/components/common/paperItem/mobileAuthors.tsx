import React from 'react';
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

const BlockAuthorItem: React.FC<{ author: PaperAuthor }> = ({ author }) => {
  let affiliation = null;
  if (author.affiliation) {
    if (author.affiliation.nameAbbrev) {
      affiliation = `${author.affiliation.nameAbbrev}: ${author.affiliation.name}`;
    }
    affiliation = author.affiliation.name;
  }

  return (
    <div className={s.blockAuthorItem}>
      <div className={s.leftBox}>
        <div className={s.authorName}>{author.name}</div>
        {author.affiliation && <div className={s.affiliation}>{affiliation}</div>}
      </div>
      <div className={s.rightBox}>{author.hindex && `H-Index: ${author.hindex}`}</div>
    </div>
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

  let authorList = `(${paper.authors[0].name}, ..., ${paper.authors[paper.authors.length - 1].name})`;
  if (paper.authors.length < 3) {
    authorList = `(${paper.authors.map(author => author.name).join(', ')})`;
  }

  return <div className={s.oneLineAuthors}>{`${authorCount} ${authorList}`}</div>;
};

export default MobileAuthors;
