import * as React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-intersection-observing-infinity-scroll';
import { withStyles } from '../../helpers/withStylesHelper';
import PaperAPI from '../../api/paper';
import PlutoAxios from '../../api/pluto';
import alertToast from '../../helpers/makePlutoToastAction';
import AuthorListItem from '../common/authorListItem';
import { Paper } from '../../model/paper';
import Icon from '../../icons';
import { PaperAuthor } from '../../model/author';
import ArticleSpinner from '../common/spinner/articleSpinner';
import { PaperProfile } from '../../model/profile';
const styles = require('./authorListDialog.scss');

interface AuthorListDialogProps {
  paper: Paper;
  profile?: PaperProfile;
  handleCloseDialogRequest: () => void;
}

interface AuthorListDialogStates {
  authors: PaperAuthor[];
  isLoading: boolean;
  currentPage: number;
  totalPage: number;
  totalElements: number;
  isEnd: boolean;
}

@withStyles<typeof AuthorListDialog>(styles)
class AuthorListDialog extends React.PureComponent<AuthorListDialogProps, AuthorListDialogStates> {
  private cancelToken = axios.CancelToken.source();

  public constructor(props: AuthorListDialogProps) {
    super(props);

    this.state = {
      authors: [],
      isLoading: false,
      currentPage: 0,
      totalPage: 0,
      totalElements: 0,
      isEnd: false,
    };
  }
  public componentDidMount() {
    this.fetchAuthorList();
  }

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { handleCloseDialogRequest, paper } = this.props;
    const { totalElements, isEnd, currentPage, isLoading } = this.state;

    return (
      <div className={styles.dialogWrapper}>
        <div className={styles.header}>
          <div className={styles.title}>{`Author (${totalElements})`}</div>
          <div className={styles.closeBtnWrapper} onClick={handleCloseDialogRequest}>
            <Icon className={styles.closeBtn} icon="X_BUTTON" />
          </div>
        </div>
        <div className={styles.subHeader}>
          <div className={styles.paperTitle} dangerouslySetInnerHTML={{ __html: paper.title }} />
          {this.getJournalText()}
        </div>
        <div className={styles.contentBox}>
          <InfiniteScroll
            loadMoreFunc={() => {
              this.fetchAuthorList(currentPage + 1);
            }}
            isLoading={isLoading}
            hasMore={!isEnd}
            loaderComponent={<div className="loader">{this.renderLoadingSpinner()}</div>}
          >
            {this.getAuthorList()}
          </InfiniteScroll>
        </div>
      </div>
    );
  }

  private renderLoadingSpinner = () => {
    return (
      <ArticleSpinner
        style={{
          margin: '20px',
        }}
      />
    );
  };

  private getJournalText = () => {
    const { paper } = this.props;
    const { journal, year } = paper;

    if (!journal) {
      return null;
    }
    return (
      <div className={styles.paperDescription}>
        <div className={styles.journalText}>
          <Icon className={styles.journal} icon="JOURNAL" />
          {year ? (
            <span className={styles.bold}>
              {year}
              {` in `}
            </span>
          ) : null}
          <Link to={`/journals/${journal.id}`} className={styles.journalName}>
            {journal.title}
          </Link>
          {journal.impactFactor ? (
            <span className={styles.bold}>{` [IF: ${
              journal.impactFactor ? journal.impactFactor.toFixed(2) : 0
            }]`}</span>
          ) : null}
        </div>
      </div>
    );
  };

  private getAuthorList = () => {
    const { authors } = this.state;
    const { handleCloseDialogRequest, profile } = this.props;

    if (authors && authors.length > 0) {
      return authors.map(author => (
        <AuthorListItem
          author={author}
          profile={profile}
          key={author.id}
          handleCloseDialogRequest={handleCloseDialogRequest}
        />
      ));
    }
    return <div />;
  };

  private fetchAuthorList = async (page = 1) => {
    const { paper } = this.props;
    const { isLoading } = this.state;

    if (!isLoading) {
      try {
        this.setState(prevState => ({ ...prevState, isLoading: true }));

        const res = await PaperAPI.getAuthorsOfPaper({ paperId: paper.id, page, cancelToken: this.cancelToken.token });

        this.setState(prevState => ({
          ...prevState,
          authors: [...prevState.authors, ...res.data.content],
          isLoading: false,
          currentPage: page,
          totalPage: res.data.page ? res.data.page.totalPages : 1,
          totalElements: res.data.page ? res.data.page.totalElements : 0,
          isEnd: res.data.page ? res.data.page.last : true,
        }));
      } catch (err) {
        if (!axios.isCancel(err)) {
          const error = PlutoAxios.getGlobalError(err);
          this.setState(prevState => ({ ...prevState, isLoading: false }));
          if (error) {
            alertToast({
              type: 'error',
              message: error.message,
            });
          }
        }
      }
    }
  };
}
export default AuthorListDialog;
