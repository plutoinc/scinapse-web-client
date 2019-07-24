import * as React from 'react';
import axios from 'axios';
import { Switch, Route, RouteComponentProps, withRouter, Link } from 'react-router-dom';
import * as classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import { withStyles } from '../../helpers/withStylesHelper';
import Keyword from '../../components/paperShow/components/keyword';
import { Configuration } from '../../reducers/configuration';
import { CurrentUser } from '../../model/currentUser';
import { Author, authorSchema } from '../../model/author/author';
import { Paper, paperSchema } from '../../model/paper';
import ArticleSpinner from '../../components/common/spinner/articleSpinner';
import ScinapseInput from '../../components/common/scinapseInput';
import { LayoutState } from '../../components/layouts/records';
import { ConnectedAuthorShowState } from './reducer';
import PaperItem from '../../components/common/paperItem';
import DesktopPagination from '../../components/common/desktopPagination';
import CoAuthor from '../../components/common/coAuthor';
import RepresentativePublicationsDialog from '../../components/dialog/components/representativePublications';
import SortBox, { AUTHOR_PAPER_LIST_SORT_TYPES } from '../../components/common/sortBox';
import TransparentButton from '../../components/common/transparentButton';
import ModifyProfile, { ModifyProfileFormState } from '../../components/dialog/components/modifyProfile';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import {
  updateAuthor,
  removePaperFromPaperList,
  openAddPublicationsToAuthorDialog,
  fetchAuthorPapers,
  updateRepresentativePapers,
} from '../../actions/author';
import PlutoAxios from '../../api/pluto';
import { ActionCreators } from '../../actions/actionTypes';
import alertToast from '../../helpers/makePlutoToastAction';
import AuthorShowHeader from '../../components/authorShowHeader';
import formatNumber from '../../helpers/formatNumber';
import { AppState } from '../../reducers';
import { trackEvent } from '../../helpers/handleGA';
import AuthorCvSection from '../authorCvSection';
import { getAuthor } from '../unconnectedAuthorShow/actions';
import ErrorPage from '../../components/error/errorPage';
import ImprovedFooter from '../../components/layouts/improvedFooter';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../components/locationListener';
const styles = require('./connectedAuthor.scss');

export interface ConnectedAuthorShowMatchParams {
  authorId: string;
}

interface ConnectedAuthorShowOwnState {
  isOpenSelectedPaperDialog: boolean;
  isOpenModifyProfileDialog: boolean;
}

export interface ConnectedAuthorShowProps extends RouteComponentProps<{ authorId: string }> {
  layout: LayoutState;
  author: Author;
  coAuthors: Author[];
  papers: Paper[];
  authorShow: ConnectedAuthorShowState;
  configuration: Configuration;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
}

@withStyles<typeof ConnectedAuthorShow>(styles)
class ConnectedAuthorShow extends React.PureComponent<ConnectedAuthorShowProps, ConnectedAuthorShowOwnState> {
  private cancelToken = axios.CancelToken.source();

  public constructor(props: ConnectedAuthorShowProps) {
    super(props);

    this.state = {
      isOpenSelectedPaperDialog: false,
      isOpenModifyProfileDialog: false,
    };
  }

  public componentDidMount() {
    const { currentUser, author, authorShow } = this.props;

    if (currentUser.isLoggedIn && currentUser.isAuthorConnected && currentUser.authorId === author.id) {
      this.fetchPapers(authorShow.papersCurrentPage, 'RECENTLY_ADDED');
    }
  }

  public componentWillReceiveProps(nextProps: ConnectedAuthorShowProps) {
    const { currentUser, author, authorShow } = this.props;

    const hasAuthStatusChanged = nextProps.currentUser.isLoggedIn !== currentUser.isLoggedIn;
    const wasDefaultSortOption =
      authorShow.papersSort === 'NEWEST_FIRST' &&
      authorShow.papersCurrentPage === 1 &&
      authorShow.paperSearchQuery === '';

    if (
      hasAuthStatusChanged &&
      nextProps.currentUser.isLoggedIn &&
      nextProps.currentUser.isAuthorConnected &&
      nextProps.currentUser.authorId === author.id &&
      wasDefaultSortOption
    ) {
      this.fetchPapers(authorShow.papersCurrentPage, 'RECENTLY_ADDED');
    } else if (hasAuthStatusChanged && authorShow.papersSort === 'RECENTLY_ADDED') {
      this.fetchPapers(authorShow.papersCurrentPage, 'NEWEST_FIRST');
    }
  }

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { author, authorShow, currentUser, match, location, layout } = this.props;
    const { isOpenModifyProfileDialog, isOpenSelectedPaperDialog } = this.state;
    const pathArr = location.pathname.split('/');
    const isCVPage = pathArr[pathArr.length - 1] === 'cv';

    if (authorShow.isLoadingPage) {
      return (
        <div className={styles.paperShowWrapper}>
          <ArticleSpinner style={{ margin: '200px auto' }} />
        </div>
      );
    }

    if (authorShow.pageErrorStatusCode) {
      return <ErrorPage errorNum={authorShow.pageErrorStatusCode} />;
    }

    return (
      <div className={styles.authorShowPageWrapper}>
        {this.getPageHelmet()}
        <div className={styles.rootWrapper}>
          <AuthorShowHeader
            author={author}
            userDevice={layout.userDevice}
            currentUser={currentUser}
            rightBoxContent={this.getRightBoxContent()}
            navigationContent={
              <div className={styles.tabNavigationWrapper}>
                <Link
                  to={match.url}
                  className={classNames({
                    [`${styles.currentTabNavigationItem}`]: !isCVPage,
                    [`${styles.tabNavigationItem}`]: isCVPage,
                  })}
                >
                  PUBLICATIONS
                </Link>
                <Link
                  to={`${match.url}/cv`}
                  className={classNames({
                    [`${styles.currentTabNavigationItem}`]: isCVPage,
                    [`${styles.tabNavigationItem}`]: !isCVPage,
                  })}
                >
                  INFORMATION
                </Link>
              </div>
            }
          />
          <div className={styles.contentBox}>
            <div className={styles.container}>
              <Switch>
                <Route path={`${match.url}/cv`} exact={true}>
                  <AuthorCvSection />
                </Route>
                <Route path={match.url} exact={true}>
                  <div className={styles.leftContentWrapper}>
                    {this.getSelectedPublicationsArea()}
                    <div className={styles.allPublicationHeader}>
                      <span className={styles.sectionTitle}>All Publications</span>
                      <span className={styles.countBadge}>{author.paperCount}</span>
                      <div className={styles.rightBox}>{this.getAddPublicationsButton()}</div>
                    </div>
                    <div className={styles.selectedPaperDescription} />
                    <div className={styles.searchSortWrapper}>
                      <div className={styles.searchContainer}>
                        <ScinapseInput
                          placeholder="Search papers"
                          onSubmit={this.handleSubmitPublicationSearch}
                          icon="SEARCH_ICON"
                          wrapperStyle={{
                            borderRadius: '4px',
                            borderColor: '#f1f3f6',
                            height: '36px',
                          }}
                        />
                        <div className={styles.paperCountMetadata}>
                          {/* tslint:disable-next-line:max-line-length */}
                          {authorShow.papersCurrentPage} page of {formatNumber(authorShow.papersTotalPage)} pages ({formatNumber(
                            authorShow.papersTotalCount
                          )}{' '}
                          results)
                        </div>
                      </div>
                      <div className={styles.rightBox}>
                        <SortBox
                          sortOption={authorShow.papersSort}
                          handleClickSortOption={this.handleClickSort}
                          currentPage="authorShow"
                          exposeRecentlyUpdated={currentUser.authorId === author.id}
                          exposeRelevanceOption={false}
                        />
                      </div>
                    </div>
                    {this.getAllPublications()}
                    <div
                      className={classNames({
                        [`${styles.findPaperBtnWrapper}`]: true,
                        [`${styles.noPaperFindPaperBtnWrapper}`]: authorShow.papersTotalCount === 0,
                      })}
                    >
                      <div onClick={this.handleOpenAllPublicationsDialog} className={styles.findPaperBtn}>
                        Can't find your paper?
                      </div>
                    </div>
                    <DesktopPagination
                      type="AUTHOR_SHOW_PAPERS_PAGINATION"
                      totalPage={authorShow.papersTotalPage}
                      currentPageIndex={authorShow.papersCurrentPage - 1}
                      onItemClick={this.fetchPapers}
                      wrapperStyle={{
                        margin: '45px 0 40px 0',
                      }}
                    />
                  </div>
                </Route>
              </Switch>
              <div className={styles.rightContentWrapper}>
                {this.getCoAuthorList()}
                {this.getFosList()}
              </div>
            </div>
          </div>
        </div>
        <ImprovedFooter containerStyle={{ backgroundColor: '#f8f9fb' }} />{' '}
        {isOpenSelectedPaperDialog ? (
          <RepresentativePublicationsDialog
            currentUser={currentUser}
            isOpen={isOpenSelectedPaperDialog}
            author={author}
            handleClose={this.handleToggleRepresentativePublicationsDialog}
            handleSubmit={this.handleSubmitUpdateRepresentativePapers}
          />
        ) : null}
        <ModifyProfile
          author={author}
          handleClose={this.handleToggleModifyProfileDialog}
          isOpen={isOpenModifyProfileDialog}
          isLoading={authorShow.isLoadingToUpdateProfile}
          handleSubmitForm={this.handleSubmitProfile}
          initialValues={{
            authorName: author.name,
            currentAffiliation: author.lastKnownAffiliation || '',
            bio: author.bio || '',
            website: author.webPage || '',
            email: author.email || '',
            isEmailHidden: author.isEmailHidden || false,
          }}
        />
      </div>
    );
  }

  private getSelectedPublicationsArea = () => {
    const { author, currentUser } = this.props;

    const isMine = currentUser && currentUser.authorId === author.id;
    const emptySelectedPapers = !author.representativePapers || author.representativePapers.length === 0;

    if (!isMine && emptySelectedPapers) {
      return null;
    }

    const addSelectPublicationButton = emptySelectedPapers ? (
      <TransparentButton
        onClick={this.handleToggleRepresentativePublicationsDialog}
        gaCategory="New Author Show"
        gaAction="Click Add Representative Publication Button"
        gaLabel="Try to add Representative Publications in no Pub section"
        content="Add Representative Publication"
        icon="SMALL_PLUS"
        style={{
          marginTop: '16px',
          height: '40px',
        }}
      />
    ) : null;

    return (
      <div className={styles.selectedPublicationSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Representative Publications</span>
          <span className={styles.countBadge}>{author.representativePapers.length}</span>
          <div className={styles.rightBox}>{this.getEditSelectedPaperButton()}</div>
        </div>
        <div className={styles.selectedPaperDescription} />
        {this.getSelectedPapers()}
        <div className={styles.selectedPaperWrapper}>{addSelectPublicationButton}</div>
      </div>
    );
  };

  private getAddPublicationsButton = () => {
    const { author, currentUser } = this.props;

    if (currentUser.authorId === author.id) {
      return (
        <TransparentButton
          onClick={this.handleOpenAllPublicationsDialog}
          gaCategory="New Author Show"
          gaAction="Click Add Publication Button"
          gaLabel="Try to add Publications in Right box"
          content="Add Publications"
          icon="SMALL_PLUS"
        />
      );
    }
    return null;
  };

  private getEditSelectedPaperButton = () => {
    const { author, currentUser } = this.props;

    if (currentUser.authorId === author.id) {
      return (
        <TransparentButton
          onClick={this.handleToggleRepresentativePublicationsDialog}
          gaCategory="New Author Show"
          gaAction="Click Add Representative Publication Button"
          gaLabel="Try to add Representative Publications use Manage List Button"
          content="Manage List"
          icon="PEN"
          iconStyle={{
            marginRight: '8px',
            width: '18px',
            height: '18px',
          }}
        />
      );
    }
    return null;
  };

  private getRightBoxContent = () => {
    const { author, currentUser } = this.props;

    if (currentUser.authorId === author.id) {
      return (
        <TransparentButton
          style={{
            height: '36px',
            fontWeight: 'bold',
            padding: '0 16px 0 8px',
          }}
          iconStyle={{
            marginRight: '8px',
            width: '20px',
            height: '20px',
          }}
          onClick={this.handleToggleModifyProfileDialog}
          gaCategory="New Author Show"
          gaAction="Click Edit Profile Button"
          gaLabel="Try to Edit Profile"
          content="Edit Profile"
          icon="PEN"
        />
      );
    }
    return null;
  };

  private handleRemovePaper = async (paper: Paper) => {
    const { dispatch, author, currentUser } = this.props;

    if (
      confirm(
        // tslint:disable-next-line:max-line-length
        "Do you REALLY want to remove this paper from your publication list?\nThis will also delete it from your 'Representative Publications'."
      )
    ) {
      await dispatch(
        removePaperFromPaperList({
          authorId: author.id,
          papers: [paper],
          cancelToken: this.cancelToken.token,
          currentUser,
        })
      );
    }
  };

  private handleOpenAllPublicationsDialog = () => {
    const { dispatch } = this.props;

    trackEvent({
      category: 'New Author Show',
      action: 'Click Add Publication Button',
      label: "Try to add Publications in can't find your paper",
    });

    dispatch(openAddPublicationsToAuthorDialog());
  };

  private getFosList = () => {
    const { author } = this.props;

    if (author.fosList && author.fosList.length > 0) {
      const fosList = author.fosList.map(fos => {
        return <Keyword pageType="authorShow" fos={fos} key={fos.id} />;
      });

      return (
        <div className={styles.fosListWrapper}>
          <div className={styles.fosHeader}>Top Field Of Study</div>
          <div className={styles.fosList}>{fosList}</div>
        </div>
      );
    }
    return null;
  };

  private handleSubmitUpdateRepresentativePapers = (papers: Paper[]) => {
    const { dispatch, author } = this.props;

    dispatch(
      ActionCreators.succeedToUpdateAuthorRepresentativePapers({
        authorId: author.id,
        papers,
      })
    );
  };

  private handleSubmitProfile = async (profile: ModifyProfileFormState) => {
    const { dispatch, author } = this.props;

    let affiliationId: number | null = null;
    let affiliationName = '';
    if ((profile.currentAffiliation as Affiliation).name) {
      affiliationId = (profile.currentAffiliation as Affiliation).id;
      affiliationName = (profile.currentAffiliation as Affiliation).name;
    } else if ((profile.currentAffiliation as SuggestAffiliation).keyword) {
      affiliationId = (profile.currentAffiliation as SuggestAffiliation).affiliationId;
      affiliationName = (profile.currentAffiliation as SuggestAffiliation).keyword;
    }

    try {
      await dispatch(
        updateAuthor({
          authorId: author.id,
          bio: profile.bio || null,
          email: profile.email,
          name: profile.authorName,
          webPage: profile.website || null,
          affiliationId,
          affiliationName,
          isEmailHidden: profile.isEmailHidden,
        })
      );
      this.setState(prevState => ({ ...prevState, isOpenModifyProfileDialog: false }));
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      alertToast({
        type: 'error',
        message: 'Had an error to update user profile.',
      });
      dispatch(ActionCreators.failedToUpdateProfileData());
    }
  };

  private handleToggleModifyProfileDialog = async () => {
    const { isOpenModifyProfileDialog } = this.state;
    const { dispatch, author } = this.props;

    this.setState(prevState => ({ ...prevState, isOpenModifyProfileDialog: !isOpenModifyProfileDialog }));

    if (!isOpenModifyProfileDialog) {
      try {
        await dispatch(getAuthor(author.id, this.cancelToken.token));
      } catch (err) {
        const error = PlutoAxios.getGlobalError(err);
        console.error(error);
        alertToast({
          type: 'error',
          message: 'Had an error to get user profile.',
        });
        dispatch(ActionCreators.failedToGetAuthorList());
      }
    }
  };

  private handleToggleRepresentativePublicationsDialog = () => {
    const { isOpenSelectedPaperDialog } = this.state;

    this.setState(prevState => ({ ...prevState, isOpenSelectedPaperDialog: !isOpenSelectedPaperDialog }));
  };

  private getCoAuthorList = () => {
    const { coAuthors } = this.props;

    if (coAuthors && coAuthors.length > 0) {
      const coAuthorList = coAuthors.map(author => {
        return <CoAuthor key={author.id} author={author} />;
      });

      return (
        <div>
          <div className={styles.coAuthorHeader}>Co-authors</div>
          {coAuthorList}
        </div>
      );
    }
    return null;
  };

  private handleSubmitPublicationSearch = (query: string) => {
    const { dispatch, authorShow, author } = this.props;

    if (!author || !dispatch) return;

    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: 'fire',
      actionArea: 'authorShow',
      actionTag: 'query',
      actionLabel: query,
    });

    dispatch(
      fetchAuthorPapers({
        query,
        authorId: author.id,
        sort: authorShow.papersSort,
        page: 1,
        cancelToken: this.cancelToken.token,
      })
    );
  };

  private handleClickSort = (option: AUTHOR_PAPER_LIST_SORT_TYPES) => {
    const { dispatch, authorShow, author } = this.props;

    dispatch(
      fetchAuthorPapers({
        authorId: author.id,
        sort: option,
        page: authorShow.papersCurrentPage,
        cancelToken: this.cancelToken.token,
      })
    );
  };

  private fetchPapers = (page: number, sort?: AUTHOR_PAPER_LIST_SORT_TYPES) => {
    const { dispatch, authorShow, author } = this.props;

    dispatch(
      fetchAuthorPapers({
        authorId: author.id,
        sort: sort || authorShow.papersSort,
        page,
        cancelToken: this.cancelToken.token,
      })
    );
  };

  private handleToggleRepresentativePaperButton = (paper: Paper) => {
    const { dispatch, author } = this.props;

    const isRepresentative = author.representativePapers.some(repPaper => repPaper.id === paper.id);

    if (author.representativePapers.length === 5 && !isRepresentative) {
      return window.alert('You have exceeded the number of choices available.');
    }

    let newRepresentativePapers: Paper[] = [];
    if (isRepresentative) {
      const index = author.representativePapers.findIndex(repPaper => repPaper.id === paper.id);
      newRepresentativePapers = [
        ...author.representativePapers.slice(0, index),
        ...author.representativePapers.slice(index + 1),
      ];
    } else {
      newRepresentativePapers = [...author.representativePapers, ...[paper]];
    }

    dispatch(updateRepresentativePapers(author.id, newRepresentativePapers));
  };

  private getAllPublications = () => {
    const { authorShow, papers, currentUser, author } = this.props;

    if (authorShow.isLoadingPapers) {
      return <ArticleSpinner style={{ margin: '170px auto' }} />;
    }

    if (papers && papers.length > 0) {
      return papers.map(paper => {
        return (
          <PaperItem
            key={paper.id}
            pageType="authorShow"
            actionArea="paperList"
            paper={paper}
            currentUser={currentUser}
            omitAbstract={true}
            hasRemoveButton={true}
            handleRemovePaper={this.handleRemovePaper}
            isRepresentative={author.representativePapers.some(repPaper => repPaper.id === paper.id)}
            handleToggleRepresentative={this.handleToggleRepresentativePaperButton}
          />
        );
      });
    }

    const isMine = currentUser && currentUser.authorId === author.id;
    const addPublicationsBtn = isMine ? (
      <TransparentButton
        onClick={this.handleOpenAllPublicationsDialog}
        gaCategory="New Author Show"
        gaAction="Click Add Publication Button"
        gaLabel="Try to add Publications in no Pub section"
        content="Add Publications"
        icon="SMALL_PLUS"
        style={{
          height: '40px',
          marginTop: '16px',
        }}
      />
    ) : null;

    return (
      <div className={styles.noPaperWrapper}>
        <div className={styles.noPaperDescription}>There is no publications.</div>
        {addPublicationsBtn}
      </div>
    );
  };

  private getSelectedPapers = () => {
    const { author, currentUser } = this.props;

    if (author.representativePapers && author.representativePapers.length > 0) {
      return author.representativePapers.map(paper => {
        return (
          <PaperItem
            pageType="authorShow"
            actionArea="paperList"
            key={paper.id}
            paper={paper}
            omitAbstract={true}
            currentUser={currentUser}
            isRepresentative={author.representativePapers.some(repPaper => repPaper.id === paper.id)}
            handleToggleRepresentative={this.handleToggleRepresentativePaperButton}
          />
        );
      });
    }

    return (
      <div className={styles.noPaperWrapper}>
        <div className={styles.noPaperDescription}>There is no representative papers.</div>
      </div>
    );
  };

  private makeStructuredData = () => {
    const { author, coAuthors } = this.props;

    const affiliationName = author.lastKnownAffiliation ? author.lastKnownAffiliation.name : '';
    const colleagues = coAuthors.map(coAuthor => {
      if (!coAuthor) {
        return null;
      }
      const coAuthorAffiliation = coAuthor.lastKnownAffiliation ? coAuthor.lastKnownAffiliation.name : '';
      return {
        '@context': 'http://schema.org',
        '@type': 'Person',
        name: coAuthor.name,
        affiliation: {
          name: coAuthorAffiliation,
        },
        description: `${coAuthorAffiliation ? `${coAuthorAffiliation},` : ''} citation: ${
          coAuthor.citationCount
        }, h-index: ${coAuthor.hindex}`,
        mainEntityOfPage: 'https://scinapse.io',
      };
    });

    const structuredData: any = {
      '@context': 'http://schema.org',
      '@type': 'Person',
      name: author.name,
      affiliation: {
        name: affiliationName,
      },
      colleague: colleagues,
      description: `${affiliationName ? `${affiliationName},` : ''} citation: ${author.citationCount}, h-index: ${
        author.hindex
      }`,
      mainEntityOfPage: 'https://scinapse.io',
    };

    return structuredData;
  };

  private getPageHelmet = () => {
    const { author } = this.props;

    const affiliationName = author.lastKnownAffiliation ? author.lastKnownAffiliation.name : '';
    const description = `${affiliationName ? `${affiliationName},` : ''} citation: ${author.citationCount}, h-index: ${
      author.hindex
    }`;

    return (
      <Helmet>
        <title>{author.name}</title>
        <link rel="canonical" href={`https://scinapse.io/authors/${author.id}`} />
        <meta itemProp="name" content={`${author.name} | Scinapse | Academic search engine for paper`} />
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:card" content={`${author.name} | Scinapse | Academic search engine for paper`} />
        <meta name="twitter:title" content={`${author.name} | Scinapse | Academic search engine for paper`} />
        <meta property="og:title" content={`${author.name} | Scinapse | Academic search engine for paper`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://scinapse.io/authors/${author.id}`} />
        <meta property="og:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(this.makeStructuredData())}</script>
      </Helmet>
    );
  };
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    authorShow: state.connectedAuthorShow,
    author: denormalize(state.connectedAuthorShow.authorId, authorSchema, state.entities),
    coAuthors: denormalize(state.connectedAuthorShow.coAuthorIds, [authorSchema], state.entities),
    papers: denormalize(state.connectedAuthorShow.paperIds, [paperSchema], state.entities),
    configuration: state.configuration,
    currentUser: state.currentUser,
  };
}

export default withRouter(connect(mapStateToProps)(ConnectedAuthorShow));
