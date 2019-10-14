import * as React from 'react';
import { Link } from 'react-router-dom';
import Author from './author';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperAuthor } from '../../../model/author';
import Icon from '../../../icons';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import { Paper } from '../../../model/paper';
import { trackEvent } from '../../../helpers/handleGA';
import ActionTicketManager from '../../../helpers/actionTicketManager';
const styles = require('./authorList.scss');

interface AuthorListProps {
  paper: Paper;
  authors: PaperAuthor[];
}

function handleClickButton(paper: Paper) {
  GlobalDialogManager.openAuthorListDialog(paper);
  trackEvent({
    category: 'New Paper Show',
    action: 'Click more button in PaperInfo Section',
    label: 'Click more button for Open Author List',
  });
}

const AuthorList: React.SFC<{ authors: PaperAuthor[]; paper: Paper }> = props => {
  const authorNodes = props.authors.map((author, index) => {
    const lastOrderAuthor = index === props.authors.length - 1;
    if ((author && index < 2) || lastOrderAuthor) {
      return (
        <li className={styles.authorItem} key={author.id}>
          <Link
            className={styles.authorItemAnchor}
            to={`/authors/${author.id}`}
            onClick={() => {
              ActionTicketManager.trackTicket({
                pageType: 'paperShow',
                actionType: 'fire',
                actionArea: 'paperDescription',
                actionTag: 'authorShow',
                actionLabel: String(author.id),
              });
            }}
          >
            <Author author={author} />
          </Link>
        </li>
      );
    } else if (author && index === 2) {
      return (
        <div className={styles.authorListHideLayer} key={author.id}>
          <button className={styles.authorListHideLayerButton} onClick={() => handleClickButton(props.paper)}>
            ~
          </button>
        </div>
      );
    }
  });

  return <>{authorNodes}</>;
};

const PaperAuthorList: React.SFC<AuthorListProps> = props => {
  const { authors, paper } = props;

  return (
    <div className={styles.authors}>
      <div className={styles.paperContentBlockHeader}>
        Authors
        {authors.length > 3 && (
          <button onClick={() => handleClickButton(paper)} className={styles.tinyButton}>
            <Icon icon="AUTHOR_MORE_ICON" />
            <span>View {paper.authorCount} authors</span>
          </button>
        )}
      </div>
      <ul className={styles.authorList}>
        <AuthorList authors={authors} paper={paper} />
      </ul>
    </div>
  );
};

export default withStyles<typeof PaperAuthorList>(styles)(PaperAuthorList);
