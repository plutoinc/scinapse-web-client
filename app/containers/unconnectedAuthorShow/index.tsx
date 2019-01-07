import * as React from "react";
import axios from "axios";
import { denormalize } from "normalizr";
import { Helmet } from "react-helmet";
import { Dispatch, connect } from "react-redux";
import DesktopPagination from "../../components/common/desktopPagination";
import MobilePagination from "../../components/common/mobilePagination";
import { withStyles } from "../../helpers/withStylesHelper";
import { AuthorShowState } from "./reducer";
import { Configuration } from "../../reducers/configuration";
import { CurrentUser } from "../../model/currentUser";
import { Author, authorSchema } from "../../model/author/author";
import { Paper, paperSchema } from "../../model/paper";
import SortBox, { PAPER_LIST_SORT_TYPES } from "../../components/common/sortBox";
import PaperItem from "../../components/common/paperItem";
import { getAuthorPapers, toggleConnectProfileDialog, connectAuthor } from "./actions";
import { DEFAULT_AUTHOR_PAPERS_SIZE } from "../../api/author";
import ArticleSpinner from "../../components/common/spinner/articleSpinner";
import CoAuthor from "../../components/common/coAuthor";
import ModifyProfile, { ModifyProfileFormState } from "../../components/dialog/components/modifyProfile";
import TransparentButton from "../../components/common/transparentButton";
import { LayoutState, UserDevice } from "../../components/layouts/records";
import Footer from "../../components/layouts/footer";
import AuthorShowHeader from "../../components/authorShowHeader";
import { SuggestAffiliation } from "../../api/suggest";
import { Affiliation } from "../../model/affiliation";
import { AUTH_LEVEL, checkAuth } from "../../helpers/checkAuthDialog";
import { AppState } from "../../reducers";
import { fetchAuthorPapers } from "../../actions/author";
import EnvChecker from "../../helpers/envChecker";
const styles = require("./authorShow.scss");

export interface AuthorShowMatchParams {
  authorId: string;
}

export interface HandleAuthorClaim {
  authorId: number;
}

export interface AuthorShowProps {
  layout: LayoutState;
  author: Author;
  coAuthors: Author[];
  papers: Paper[];
  authorShow: AuthorShowState;
  configuration: Configuration;
  currentUser: CurrentUser;
  isTestMode: boolean;
  dispatch: Dispatch<any>;
}

@withStyles<typeof AuthorShow>(styles)
class AuthorShow extends React.PureComponent<AuthorShowProps> {
  private cancelToken = axios.CancelToken.source();

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { author, authorShow, currentUser, isTestMode } = this.props;

    if (!author) {
      return null;
    }

    if (authorShow.isLoadingPage) {
      return (
        <div className={styles.paperShowWrapper}>
          <ArticleSpinner style={{ margin: "200px auto" }} />
        </div>
      );
    }

    let itsMeButton = (
      <div className={styles.headerRightBox}>
        <a
          className={styles.authorClaimButton}
          onClick={() => this.handleAuthorClaim({ authorId: this.props.author.id })}
        >
          SUGGEST CHANGES
        </a>
      </div>
    );
    let guideContext = null;

    if (isTestMode) {
      itsMeButton = (
        <TransparentButton
          style={{
            height: "36px",
            fontWeight: "bold",
            padding: "0 16px 0 8px",
          }}
          iconStyle={{
            marginRight: "8px",
            width: "20px",
            height: "20px",
          }}
          gaCategory="New Author Show"
          gaAction="Click It's me Button, Unconnected author"
          gaLabel="Try to occupied author page"
          content="✋ It's me"
          onClick={() => {
            if (
              confirm(
                // tslint:disable-next-line:max-line-length
                `Are you ${author.name}?\nThen press OK button, you can manage this page. (Beta)`
              )
            ) {
              this.toggleModifyProfileDialog();
            }
          }}
        />
      );

      guideContext = (
        <div className={styles.speechBubble}>
          <div>You can manage your author page here!</div>
        </div>
      );
    }

    return (
      <div className={styles.authorShowPageWrapper}>
        {this.getPageHelmet()}
        <div className={styles.rootWrapper}>
          <AuthorShowHeader
            author={author}
            rightBoxContent={itsMeButton}
            navigationContent={null}
            guideBubbleSpeech={guideContext}
          />
          <div className={styles.contentBox}>
            <div className={styles.container}>
              <div className={styles.contentFlexWrapper}>
                <div className={styles.contentLeftBox}>
                  <div className={styles.paperListBox}>
                    <div className={styles.paperListHeader}>
                      <div className={styles.paperListLeft}>
                        <span className={styles.paperListTitle}>Publications</span>
                        <span className={styles.paperListTitleNumber}>{` ${author.paperCount}`}</span>
                      </div>

                      <div className={styles.paperListRight}>
                        <SortBox
                          sortOption={authorShow.papersSort}
                          handleClickSortOption={this.handleClickSortOption}
                        />
                      </div>
                    </div>

                    <div className={styles.paperListContent}>{this.getPaperList()}</div>
                    {this.getPagination()}
                  </div>
                </div>

                <div className={styles.contentRightBox}>
                  <div className={styles.coAuthorTitleBox}>
                    <span className={styles.coAuthorListTitle}>Co-Authors</span>
                  </div>
                  <div className={styles.coAuthorList}>{this.getCoAuthors()}</div>
                </div>
              </div>
            </div>
          </div>

          <ModifyProfile
            author={author}
            handleClose={this.toggleModifyProfileDialog}
            isOpen={authorShow.isOpenConnectProfileDialog}
            isLoading={authorShow.isLoadingToUpdateProfile}
            handleSubmitForm={this.handleConnectAuthor}
            initialValues={{
              authorName: author.name,
              currentAffiliation: author.lastKnownAffiliation || "",
              bio: author.bio || "",
              website: author.webPage || "",
              email: currentUser.isLoggedIn ? currentUser.email : "",
              isEmailHidden: author.isEmailHidden || false,
            }}
          />
        </div>
        <Footer />
      </div>
    );
  }

  private handleConnectAuthor = async (profile: ModifyProfileFormState) => {
    const { dispatch, author } = this.props;

    let affiliationId: number | null = null;
    let affiliationName: string | null = null;
    if ((profile.currentAffiliation as Affiliation).name) {
      affiliationId = (profile.currentAffiliation as Affiliation).id;
      affiliationName = (profile.currentAffiliation as Affiliation).name;
    } else if ((profile.currentAffiliation as SuggestAffiliation).keyword) {
      affiliationId = (profile.currentAffiliation as SuggestAffiliation).affiliation_id;
      affiliationName = (profile.currentAffiliation as SuggestAffiliation).keyword;
    }

    dispatch(
      connectAuthor({
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
  };

  private toggleModifyProfileDialog = () => {
    const { dispatch } = this.props;

    if (checkAuth(AUTH_LEVEL.VERIFIED)) {
      dispatch(toggleConnectProfileDialog());
    }
  };

  private getPagination = () => {
    const { authorShow, layout } = this.props;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return (
        <MobilePagination
          totalPageCount={authorShow.papersTotalPage}
          currentPageIndex={authorShow.papersCurrentPage - 1}
          onItemClick={this.handleClickPagination}
          wrapperStyle={{
            margin: "24px 0 40px 0",
          }}
        />
      );
    } else {
      return (
        <DesktopPagination
          type="AUTHOR_SHOW_PAPERS_PAGINATION"
          totalPage={authorShow.papersTotalPage}
          currentPageIndex={authorShow.papersCurrentPage - 1}
          onItemClick={this.handleClickPagination}
          wrapperStyle={{
            margin: "24px 0 40px 0",
          }}
        />
      );
    }
  };

  private handleClickPagination = (page: number) => {
    const { dispatch, authorShow, author } = this.props;

    dispatch(
      fetchAuthorPapers({
        authorId: author.id,
        sort: authorShow.papersSort,
        page,
        cancelToken: this.cancelToken.token,
      })
    );
  };

  private makeStructuredData = () => {
    const { author, coAuthors } = this.props;

    const affiliationName = author.lastKnownAffiliation ? author.lastKnownAffiliation.name : "";
    const colleagues = coAuthors.map(coAuthor => {
      if (!coAuthor) {
        return null;
      }
      const coAuthorAffiliation = coAuthor.lastKnownAffiliation ? coAuthor.lastKnownAffiliation.name : "";
      return {
        "@context": "http://schema.org",
        "@type": "Person",
        name: coAuthor.name,
        affiliation: {
          name: coAuthorAffiliation,
        },
        description: `${coAuthorAffiliation ? `${coAuthorAffiliation},` : ""} citation: ${
          coAuthor.citationCount
        }, h-index: ${coAuthor.hIndex}`,
        mainEntityOfPage: "https://scinapse.io",
      };
    });

    const structuredData: any = {
      "@context": "http://schema.org",
      "@type": "Person",
      name: author.name,
      affiliation: {
        name: affiliationName,
      },
      colleague: colleagues,
      description: `${affiliationName ? `${affiliationName},` : ""} citation: ${author.citationCount}, h-index: ${
        author.hIndex
      }`,
      mainEntityOfPage: "https://scinapse.io",
    };

    return structuredData;
  };

  private getPageHelmet = () => {
    const { author } = this.props;
    const affiliationName = author.lastKnownAffiliation ? author.lastKnownAffiliation.name : "";
    const description = `${affiliationName ? `${affiliationName},` : ""} citation: ${author.citationCount}, h-index: ${
      author.hIndex
    }`;

    return (
      <Helmet>
        <title>{author.name}</title>
        <meta itemProp="name" content={`${author.name} | Sci-napse | Academic search engine for paper`} />
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:card" content={`${author.name} | Sci-napse | Academic search engine for paper`} />
        <meta name="twitter:title" content={`${author.name} | Sci-napse | Academic search engine for paper`} />
        <meta property="og:title" content={`${author.name} | Sci-napse | Academic search engine for paper`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://scinapse.io/authors/${author.id}`} />
        <meta property="og:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(this.makeStructuredData())}</script>
      </Helmet>
    );
  };

  private handleClickSortOption = (sortOption: PAPER_LIST_SORT_TYPES) => {
    const { dispatch, author } = this.props;

    if (author) {
      dispatch!(
        getAuthorPapers({
          authorId: author.id,
          page: 1,
          size: DEFAULT_AUTHOR_PAPERS_SIZE,
          sort: sortOption,
          cancelToken: this.cancelToken.token,
        })
      );
    }
  };

  private getCoAuthors = () => {
    const { coAuthors } = this.props;

    return coAuthors.map(author => {
      if (!author) {
        return null;
      }
      return <CoAuthor key={author.id} author={author} />;
    });
  };

  private getPaperList = () => {
    const { papers, currentUser } = this.props;

    return papers.map(paper => {
      if (paper) {
        return (
          <PaperItem
            currentUser={currentUser}
            pageType="authorShow"
            actionArea="paperList"
            paper={paper}
            key={`author_papers_${paper.id}`}
          />
        );
      }
    });
  };

  private handleAuthorClaim = ({ authorId }: HandleAuthorClaim) => {
    const targetId = authorId;

    if (!EnvChecker.isOnServer()) {
      window.open(
        // tslint:disable-next-line:max-line-length
        `https://docs.google.com/forms/d/e/1FAIpQLSd6FqawNtamoqw6NE0Q7BYS1Pn4O0FIbK1VI_47zbRWxDzgXw/viewform?entry.1961255815=${targetId}`,
        "_blank"
      );
    }
  };
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    authorShow: state.authorShow,
    author: denormalize(state.authorShow.authorId, authorSchema, state.entities),
    coAuthors: denormalize(state.authorShow.coAuthorIds, [authorSchema], state.entities),
    papers: denormalize(state.authorShow.paperIds, [paperSchema], state.entities),
    configuration: state.configuration,
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps)(AuthorShow);
