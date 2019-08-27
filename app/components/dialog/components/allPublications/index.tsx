import * as React from 'react';
import axios from 'axios';
import { denormalize } from 'normalizr';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Checkbox from '@material-ui/core/Checkbox';
import AuthorAPI from '../../../../api/author';
import ScinapseInput from '../../../common/scinapseInput';
import Authors from '../../../common/paperItem/authors';
import PaperItemVenue from '../../../common/paperItem/venue';
import { withStyles } from '../../../../helpers/withStylesHelper';
import ScinapseButton from '../../../common/scinapseButton';
import Icon from '../../../../icons';
import { Author, authorSchema } from '../../../../model/author/author';
import alertToast from '../../../../helpers/makePlutoToastAction';
import PlutoAxios from '../../../../api/pluto';
import { CurrentUser } from '../../../../model/currentUser';
import { Paper } from '../../../../model/paper';
import { AppState } from '../../../../reducers';
import { closeDialog } from '../../actions';
import { addPapersAndFetchPapers } from '../../../../actions/author';
import { trackEvent } from '../../../../helpers/handleGA';
import { getCurrentPageType } from '../../../locationListener';
const styles = require('./allPublications.scss');

interface AllPublicationsDialogProps {
  author: Author | null;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
}

interface AllPublicationsDialogState {
  papers: Paper[];
  selectedPapers: Paper[];
  isLoading: boolean;
  currentPage: number;
  isEnd: boolean;
  searchInput: string;
}

class AllPublicationsDialog extends React.PureComponent<AllPublicationsDialogProps, AllPublicationsDialogState> {
  private cancelToken = axios.CancelToken.source();

  public constructor(props: AllPublicationsDialogProps) {
    super(props);

    this.state = {
      papers: [],
      selectedPapers: [],
      isLoading: false,
      currentPage: 1,
      isEnd: false,
      searchInput: '',
    };
  }

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { searchInput, isLoading, selectedPapers } = this.state;

    return (
      <div className={styles.dialogWrapper}>
        <div className={styles.dialogHeader}>
          <div className={styles.mainTitle}>
            Add Publications
            <div className={styles.countBadge}>
              <span>{selectedPapers.length}</span>
            </div>
          </div>
          <div className={styles.closeButton} onClick={this.handleCloseDialog}>
            <Icon className={styles.closeIcon} icon="X_BUTTON" />
          </div>
        </div>
        <ScinapseInput
          onChange={this.handleChangeSearchInput}
          value={searchInput}
          placeholder="Search for paper to be included in the publication list"
          onSubmit={this.handleSubmitSearch}
          autoFocus={true}
          icon="SEARCH_ICON"
        />
        <div>
          {this.getSelectedPapersTitle()}
          <div
            className={classNames({
              [`${styles.countSection}`]: true,
              [`${styles.noCountSection}`]: selectedPapers.length === 0,
            })}
          >
            <span className={styles.selectedCount}>{selectedPapers.length} selected</span>
          </div>
        </div>
        <div className={styles.contentSection}>{this.getPaperList()}</div>
        <div className={styles.footer}>
          <div className={styles.buttonsWrapper}>
            <ScinapseButton
              style={{
                backgroundColor: isLoading ? '#ecf1fa' : '#6096ff',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                width: '160px',
                height: '40px',
              }}
              disabled={isLoading}
              isLoading={isLoading}
              gaCategory="New Author Show"
              gaAction="Click Add Button in Add Publication"
              content={`Add ${selectedPapers.length} Publications`}
              onClick={this.handleSavingSelectedPublications}
            />
          </div>
        </div>
      </div>
    );
  }

  private handleChangeSearchInput = (e: React.FormEvent<HTMLInputElement>) => {
    const searchInput = e.currentTarget.value;
    this.setState(prevState => ({ ...prevState, searchInput }));
  };

  private handleSavingSelectedPublications = async () => {
    const { author, dispatch, currentUser } = this.props;
    const { selectedPapers } = this.state;

    if (author) {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      const params = {
        authorId: author.id,
        papers: selectedPapers,
        cancelToken: this.cancelToken.token,
        currentUser,
      };

      try {
        await dispatch(addPapersAndFetchPapers(params));

        this.setState(prevState => ({ ...prevState, isLoading: false }));

        dispatch(closeDialog());
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error(err);
          this.setState(prevState => ({ ...prevState, isLoading: false }));
          const error = PlutoAxios.getGlobalError(err);
          alertToast({
            type: 'error',
            message: error.message,
          });
        }
      }
    }
  };

  private getPaperList = () => {
    const { papers, isEnd } = this.state;

    if (papers && papers.length > 0) {
      const paperList = papers.map(paper => {
        return this.getPaperItem(paper);
      });

      return (
        <div>
          {paperList}
          {!isEnd ? (
            <div className={styles.loadMoreButtonWrapper}>
              <div onClick={this.handleLoadMore} className={styles.loadMoreButton}>
                <span>Load more</span>
                <Icon icon="ARROW_POINT_TO_UP" className={styles.downArrowIcon} />
              </div>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div>
        <div className={styles.noPaperIcon}>☝️️</div>
        <div className={styles.noPaper}>Search and add your publications</div>
      </div>
    );
  };

  private getPaperItem = (paper: Paper) => {
    const { selectedPapers } = this.state;

    if (paper.isAuthorIncluded) {
      return (
        <div key={paper.id} className={styles.paperItemWrapper}>
          <div className={styles.alreadyAddedIcon}>
            <Icon icon="CHECK" className={styles.checkIcon} />
          </div>
          <div className={styles.paperWrapper}>
            <div className={styles.alreadyAddedPaper}> Already added publication</div>
            <div className={styles.titleWrapper}>
              <span className={styles.paperItemTitle} style={{ color: '#bbc2d0' }}>
                {paper.title}
              </span>
            </div>
            <div className={styles.paperMeta}>
              <Icon icon="AUTHOR" />
              <Authors
                pageType={getCurrentPageType()}
                actionArea="allPublications"
                paper={paper}
                style={{ color: '#bbc2d0' }}
                readOnly={true}
                authors={paper.authors}
                disableTruncate={true}
              />
            </div>
            <div className={styles.paperMeta}>
              <PaperItemVenue
                pageType={getCurrentPageType()}
                actionArea="allPublications"
                paper={paper}
                style={{ display: 'flex', color: '#bbc2d0', fontSize: '14px' }}
                readOnly
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => {
          this.handleTogglePaper(paper);
        }}
        key={paper.id}
        className={styles.paperItemWrapper}
      >
        <Checkbox
          classes={{
            root: styles.checkBox,
            checked: styles.checkedCheckboxIcon,
          }}
          color="primary"
          checked={selectedPapers.includes(paper)}
        />
        <div className={styles.paperWrapper}>
          <span className={styles.paperItemTitle}>{paper.title}</span>
          <div className={styles.paperMeta}>
            <Icon icon="AUTHOR" />
            <Authors
              pageType={getCurrentPageType()}
              actionArea="allPublications"
              style={{ textDecoration: 'none' }}
              paper={paper}
              readOnly={true}
              authors={paper.authors}
              disableTruncate={true}
            />
          </div>
          <div className={styles.paperMeta}>
            <PaperItemVenue
              pageType={getCurrentPageType()}
              actionArea="allPublications"
              paper={paper}
              readOnly
              style={{ display: 'flex', color: '#7e8698', fontSize: '14px' }}
            />
          </div>
        </div>
      </div>
    );
  };

  private getSelectedPaperTitle = (selectedPaper: Paper) => {
    return (
      <div key={selectedPaper.id} className={styles.selectedPaperItem}>
        <div className={styles.paperTitleEllipsis}>{selectedPaper.title}</div>
        <div
          onClick={() => {
            this.handleTogglePaper(selectedPaper);
          }}
          className={styles.unSelectedButtonWrapper}
        >
          <Icon icon="X_BUTTON" className={styles.unSelectedButton} />
        </div>
      </div>
    );
  };

  private getSelectedPapersTitle = () => {
    const { selectedPapers } = this.state;

    if (selectedPapers && selectedPapers.length > 0) {
      const selectedPaperList = selectedPapers.map(paper => {
        return this.getSelectedPaperTitle(paper);
      });

      return <div className={styles.selectedPaperItemWrapper}>{selectedPaperList}</div>;
    }

    return null;
  };

  private handleSubmitSearch = () => {
    this.fetchQueryPapers(1);
  };

  private handleLoadMore = () => {
    this.fetchQueryPapers(this.state.currentPage + 1);
  };

  private fetchQueryPapers = async (page: number) => {
    const { author } = this.props;
    const { searchInput, currentPage, papers } = this.state;

    trackEvent({
      category: 'New Author Show',
      action: 'search papers to add publications',
      label: JSON.stringify({
        query: searchInput,
        page,
      }),
    });

    if (author) {
      try {
        this.setState(prevState => ({
          ...prevState,
          isLoading: true,
          isEnd: false,
          currentPage: page,
        }));

        const res = await AuthorAPI.queryAuthorPapers({
          query: searchInput,
          authorId: author.id,
          page,
          cancelToken: this.cancelToken.token,
        });

        this.setState(prevState => ({
          ...prevState,
          isLoading: false,
          papers: page === 1 ? res.data.content : [...papers, ...res.data.content],
          isEnd: res.data.page ? res.data.page.last : false,
        }));
      } catch (err) {
        if (!axios.isCancel(err)) {
          this.setState(prevState => ({ ...prevState, isLoading: false, currentPage }));
          const error = PlutoAxios.getGlobalError(err);
          console.error(error);
          alertToast({
            type: 'error',
            message: 'Had an error to search the papers',
          });
        }
      }
    }
  };

  private handleTogglePaper = (paper: Paper) => {
    const { selectedPapers } = this.state;

    const index = selectedPapers.indexOf(paper);
    if (index !== -1) {
      this.setState(prevState => ({
        ...prevState,
        selectedPapers: [...selectedPapers.slice(0, index), ...selectedPapers.slice(index + 1)],
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        selectedPapers: [paper, ...selectedPapers],
      }));
    }
  };

  private handleCloseDialog = () => {
    const { dispatch } = this.props;
    dispatch(closeDialog());
  };
}

const mapStateToProps = (appState: AppState) => {
  return {
    currentUser: appState.currentUser,
    author: denormalize(appState.authorShow.authorId, authorSchema, appState.entities),
  };
};

export default connect(mapStateToProps)(withStyles<typeof AllPublicationsDialog>(styles)(AllPublicationsDialog));
