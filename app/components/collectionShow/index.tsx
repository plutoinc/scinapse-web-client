import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import * as distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import { denormalize } from "normalizr";
import { Helmet } from "react-helmet";
import { AppState } from "../../reducers";
import PaperItem from "../common/paperItem";
import ArticleSpinner from "../common/spinner/articleSpinner";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUser } from "../../model/currentUser";
import { CollectionShowState } from "./reducer";
import { collectionSchema, Collection } from "../../model/collection";
import { fetchCollectionShowData } from "./sideEffect";
import { Configuration } from "../../reducers/configuration";
import { paperSchema, Paper } from "../../model/paper";
import Footer from "../layouts/footer";
import Icon from "../../icons";
const styles = require("./collectionShow.scss");

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
    collectionShow: state.collectionShow,
    configuration: state.configuration,
    collection: denormalize(state.collectionShow.mainCollectionId, collectionSchema, state.entities),
    papers: denormalize(state.collectionShow.paperIds, [paperSchema], state.entities),
  };
}

export interface CollectionShowMatchParams {
  collectionId: string;
}

export interface CollectionShowProps
  extends RouteComponentProps<CollectionShowMatchParams>,
    Readonly<{
      currentUser: CurrentUser;
      configuration: Configuration;
      collectionShow: CollectionShowState;
      collection: Collection | undefined;
      papers: Paper[] | undefined;
      dispatch: Dispatch<any>;
    }> {}

@withStyles<typeof CollectionShow>(styles)
class CollectionShow extends React.PureComponent<CollectionShowProps, {}> {
  public componentDidMount() {
    const { dispatch, match, location, configuration } = this.props;

    const notRenderedAtServerOrJSAlreadyInitialized = !configuration.initialFetched || configuration.clientJSRendered;

    if (notRenderedAtServerOrJSAlreadyInitialized) {
      fetchCollectionShowData({
        dispatch,
        match,
        pathname: location.pathname,
      });
    }
  }

  public componentWillReceiveProps(nextProps: CollectionShowProps) {
    const { dispatch, match, location } = nextProps;

    const currentCollectionId = this.props.match.params.collectionId;
    const nextCollectionId = match.params.collectionId;

    if (currentCollectionId !== nextCollectionId) {
      fetchCollectionShowData({
        dispatch,
        match,
        pathname: location.pathname,
      });
    }
  }

  public render() {
    const { collectionShow, collection } = this.props;

    if (collectionShow.isLoadingCollection) {
      return (
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <ArticleSpinner className={styles.loadingSpinner} />
          </div>
        </div>
      );
    } else if (collection) {
      return (
        <div>
          {this.getPageHelmet()}
          <div className={styles.headSection}>
            <div className={styles.container}>
              <div className={styles.leftBox}>
                <div className={styles.title}>{collection.title}</div>
                <div className={styles.description}>{collection.description}</div>
                <div className={styles.infoWrapper}>
                  <span>Created by</span>
                  <strong>{` ${collection.created_by.name} · `}</strong>
                  <span>{`Last updated `}</span>
                  <strong>{`${distanceInWordsToNow(collection.created_at)} `}</strong>
                  <span>ago</span>
                </div>
              </div>
              <div className={styles.rightBox} />
            </div>
          </div>

          <div className={styles.paperListContainer}>
            <div className={styles.leftBox}>
              <div className={styles.paperListBox}>
                <div className={styles.header}>
                  <div className={styles.listTitle}>
                    <span>{`Papers `}</span>
                    <span className={styles.paperCount}>{collection.paper_count}</span>
                  </div>
                </div>
                <div>{this.getPaperList()}</div>
              </div>
            </div>
            <div className={styles.rightBox} />
          </div>
          <Footer
            containerStyle={{ position: "fixed", left: 0, right: 0, bottom: 0, backgroundColor: "white", zIndex: 100 }}
          />
        </div>
      );
    } else {
      return null;
    }
  }

  private getPageHelmet = () => {
    const { collection } = this.props;

    if (collection) {
      return (
        <Helmet>
          <title>{collection.title} | Sci-napse</title>
          <meta itemProp="name" content={`${collection.title} | Sci-napse`} />
          <meta name="description" content={`${collection.created_by.name}'s ${collection.title} collection`} />
          <meta name="twitter:description" content={`${collection.created_by.name}'s ${collection.title} collection`} />
          <meta name="twitter:card" content={`${collection.title} | Sci-napse`} />
          <meta name="twitter:title" content={`${collection.title} | Sci-napse`} />
          <meta property="og:title" content={`${collection.title} | Sci-napse`} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://scinapse.io/collections/${collection.id}`} />
          <meta property="og:description" content={`${collection.created_by.name}'s ${collection.title} collection`} />
        </Helmet>
      );
    }
  };

  private getPaperList = () => {
    const { papers, currentUser } = this.props;

    if (papers && papers.length > 0) {
      return papers.map(paper => (
        <PaperItem currentUser={currentUser} paper={paper} key={`collection_papers_${paper.id}`} />
      ));
    } else {
      return (
        <div className={styles.noPaperWrapper}>
          <Icon icon="UFO" className={styles.ufoIcon} />
          <div className={styles.noPaperDescription}>No paper in this collection.</div>
        </div>
      );
    }
  };
}

export default connect(mapStateToProps)(withRouter(CollectionShow));
