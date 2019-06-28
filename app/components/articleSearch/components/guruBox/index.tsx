import * as React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../../icons';
import { withStyles } from '../../../../helpers/withStylesHelper';
import { MatchEntityAuthor } from '../../../../api/search';
import ActionTicketManager from '../../../../helpers/actionTicketManager';
import { getUserGroupName } from '../../../../helpers/abTestHelper';
import { GURU_AT_SEARCH_TEST } from '../../../../constants/abTestGlobalValue';
import { SetStateAction } from 'react';
const styles = require('./guruBox.scss');

const MAX_AUTHOR_COUNT = 4;
const AUTHOR_ITEM_HEIGHT = 86;

interface GuruBoxProps {
  authors: MatchEntityAuthor[] | null;
  isLoading: boolean;
}
interface AuthorListProps {
  authors: MatchEntityAuthor[];
  isLoading: boolean;
  isOpen: boolean;
}
interface MoreBtnProps {
  isOpen: boolean;
  onClick: React.Dispatch<SetStateAction<boolean>>;
}

const GuruItemBox: React.FC<{ author: MatchEntityAuthor; position: number }> = ({ author, position }) => {
  let hIndexBox = null;
  if (author.hindex) {
    hIndexBox = (
      <div className={styles.rightBox}>
        <div className={styles.hIndexCount}>{author.hindex}</div>
        <div className={styles.hIndexTitle}>H-Index</div>
      </div>
    );
  }

  let affiliation = '-';
  let fosList = '-';
  if (author.lastKnownAffiliation) {
    affiliation = author.lastKnownAffiliation.name;
  }
  if (author.fosList && author.fosList.length > 0) {
    fosList = author.fosList
      .slice(0, 3)
      .map(fos => fos.name)
      .join('・');
  }

  return (
    <Link
      onClick={() => {
        ActionTicketManager.trackTicket({
          pageType: 'searchResult',
          actionType: 'fire',
          actionArea: 'topAuthors',
          actionTag: 'authorShow',
          actionLabel: JSON.stringify({ id: author.id, name: author.name, position, hindex: author.hindex }),
        });
      }}
      to={`/authors/${author.id}`}
      className={styles.authorItem}
    >
      <div>
        <div className={styles.authorName}>{author.name}</div>
        <div className={styles.affiliation}>{affiliation}</div>
        <div className={styles.fosList}>{fosList}</div>
      </div>
      {hIndexBox}
    </Link>
  );
};

const MoreBtn: React.FC<MoreBtnProps> = ({ isOpen, onClick }) => {
  if (isOpen) {
    return (
      <div onClick={() => onClick(false)} className={styles.moreBtn}>
        <Icon icon="ARROW_POINT_TO_DOWN" className={styles.arrowDown} style={{ transform: 'rotate(180deg' }} />
        <span>less authors</span>
      </div>
    );
  }

  return (
    <div onClick={() => onClick(true)} className={styles.moreBtn}>
      <Icon icon="ARROW_POINT_TO_DOWN" className={styles.arrowDown} />
      <span>more authors</span>
    </div>
  );
};

const LoadingItem: React.FC = () => {
  return (
    <div className={styles.loadingAuthorItem}>
      <div>
        <div className={styles.authorName} />
        <div className={styles.affiliation} />
        <div className={styles.fosList} />
      </div>
      <div className={styles.rightBox}>
        <div className={styles.hIndexCount} />
      </div>
    </div>
  );
};

const AuthorList: React.FC<AuthorListProps> = ({ authors, isLoading, isOpen }) => {
  if (isLoading) {
    const list = new Array(MAX_AUTHOR_COUNT).fill(1);
    return <div className={styles.authorList}>{list.map((_, i) => <LoadingItem key={i} />)}</div>;
  }

  const targetAuthors = isOpen ? authors : authors.slice(0, MAX_AUTHOR_COUNT);
  const authorListHeight = targetAuthors.length * AUTHOR_ITEM_HEIGHT;
  const authorList = targetAuthors.map((author, index) => {
    return <GuruItemBox position={index} author={author} key={author.id} />;
  });

  return (
    <div style={{ maxHeight: authorListHeight }} className={styles.authorList}>
      {authorList}
    </div>
  );
};

const GuruBox: React.FC<GuruBoxProps> = React.memo(({ authors, isLoading }) => {
  const [shouldShow, setShouldShow] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (getUserGroupName(GURU_AT_SEARCH_TEST) === 'guru') {
      setShouldShow(true);
    }
  }, []);
  if (!shouldShow) return null;

  if (!isLoading && (!authors || authors.length === 0)) return null;

  return (
    <div className={styles.guruBoxWrapper}>
      <div className={styles.titleWrapper}>
        <Icon className={styles.authorIcon} icon="FILLED_STAR" />
        <span className={styles.title}>TOP AUTHORS</span>
      </div>
      <AuthorList authors={authors || []} isLoading={isLoading} isOpen={isOpen} />
      {authors && authors.length > MAX_AUTHOR_COUNT && <MoreBtn isOpen={isOpen} onClick={setIsOpen} />}
    </div>
  );
});

export default withStyles<typeof GuruBox>(styles)(GuruBox);
