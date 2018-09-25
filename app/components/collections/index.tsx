import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { denormalize } from "normalizr";
import { RouteComponentProps, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import * as parse from "date-fns/parse";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { getCollections } from "./sideEffect";
import { collectionSchema, Collection } from "../../model/collection";
import { UserCollectionsState } from "./reducer";
import { Member, memberSchema } from "../../model/member";
import Footer from "../layouts/footer";
import Icon from "../../icons";
import { trackEvent } from "../../helpers/handleGA";
import GlobalDialogManager from "../../helpers/globalDialogManager";
import { deleteCollection } from "../dialog/actions";
const styles = require("./collections.scss");

export interface UserCollectionsProps extends RouteComponentProps<{ userId: string }> {
  dispatch: Dispatch<any>;
  userCollections: UserCollectionsState;
  collections: Collection[] | undefined;
  member: Member | undefined;
}

function mapStateToProps(state: AppState) {
  return {
    userCollections: state.userCollections,
    collections: denormalize(state.userCollections.collectionIds, [collectionSchema], state.entities).filter(
      (c: Collection) => !!c
    ),
    member: denormalize(state.userCollections.targetMemberId, memberSchema, state.entities),
  };
}

@withStyles<typeof UserCollections>(styles)
class UserCollections extends React.PureComponent<UserCollectionsProps, {}> {
  public componentDidMount() {
    this.fetchCollections();
  }

  public componentWillReceiveProps(nextProps: UserCollectionsProps) {
    if (this.props.match.params.userId !== nextProps.match.params.userId) {
      const userId = parseInt(nextProps.match.params.userId, 10);
      this.fetchCollections(userId);
    }
  }

  public render() {
    const { userCollections, member, collections } = this.props;

    if (member && collections) {
      return (
        <div className={styles.pageWrapper}>
          <div className={styles.contentWrapper}>
            {this.getPageHelmet()}
            <div className={styles.container}>
              <div className={styles.header}>
                <div className={styles.leftBox}>
                  <span>{`${member.name}'s collections`}</span>
                  <span className={styles.collectionCount}>{userCollections.maxCollectionCount}</span>
                </div>
                <div className={styles.rightBox}>
                  <button className={styles.newCollectionBtnWrapper} onClick={this.handleClickNewCollectionButton}>
                    <Icon className={styles.plusIcon} icon="SMALL_PLUS" />
                    <span>Add Collection</span>
                  </button>
                </div>
              </div>
              {this.getCollections(collections)}
            </div>
          </div>
          <Footer containerStyle={{ backgroundColor: "#f9f9fa" }} />
        </div>
      );
    } else {
      return null;
    }
  }

  private getCollections = (collections: Collection[]) => {
    if (collections && collections.length > 0) {
      const collectionNodes = collections.map(collection => {
        const parsedUpdatedAt = parse(collection.updated_at);

        return (
          <li className={styles.collectionItem} key={`collection_item_${collection.id}`}>
            <div className={styles.titleBox}>
              <Link to={`/collections/${collection.id}`} className={styles.title}>
                {collection.title}
              </Link>
              <div className={styles.collectionControlBox}>
                <div
                  className={styles.controlIconWrapper}
                  onClick={() => {
                    this.handleClickEditCollection(collection);
                  }}
                >
                  <Icon className={styles.controlIcon} icon="PEN" />
                </div>
                <div
                  className={styles.controlIconWrapper}
                  onClick={() => {
                    this.handleDeleteCollection(collection);
                  }}
                >
                  <Icon className={styles.controlIcon} icon="TRASH_CAN" />
                </div>
              </div>
            </div>
            <div className={styles.description}>{collection.description}</div>
            <div className={styles.subInformation}>
              <span>
                <b>{`${collection.paper_count} papers · `}</b>
              </span>
              <span>{`Last updated `}</span>
              <span>
                <b>{`${distanceInWordsToNow(parsedUpdatedAt)} ago`}</b>
              </span>
            </div>
          </li>
        );
      });

      return <ul className={styles.collectionListWrapper}>{collectionNodes}</ul>;
    }
    return null;
  };

  private handleDeleteCollection = (collection: Collection) => {
    const { dispatch } = this.props;

    if (confirm(`Do you really want to DELETE collection ${collection.title}?`)) {
      dispatch(deleteCollection(collection.id));
    }
  };

  private handleClickEditCollection = (collection: Collection) => {
    GlobalDialogManager.openEditCollectionDialog(collection);
    trackEvent({
      category: "Additional Action",
      action: "Click [Edit Collection] Button",
      label: "my collection list page",
    });
  };

  private handleClickNewCollectionButton = () => {
    GlobalDialogManager.openNewCollectionDialog();
    trackEvent({
      category: "Additional Action",
      action: "Click [New Collection] Button",
      label: "my collection list page",
    });
  };

  private fetchCollections = (userId?: number) => {
    const { dispatch, match, location } = this.props;

    getCollections({
      dispatch,
      match,
      pathname: location.pathname,
      userId,
    });
  };

  private getPageHelmet = () => {
    const { collections, member } = this.props;

    if (collections && member) {
      const headCollections = collections
        .map(c => c.title)
        .slice(0, 3)
        .join(" | ");

      return (
        <Helmet>
          <title>{`${member.name}'s paper collections | Sci-napse`}</title>
          <meta itemProp="name" content={`${member.name}'s paper collections | Sci-napse`} />
          <meta name="description" content={headCollections} />
          <meta name="twitter:description" content={headCollections} />
          <meta property="og:description" content={headCollections} />
          <meta name="twitter:card" content={`${member.name}'s paper collections | Sci-napse`} />
          <meta name="twitter:title" content={`${member.name}'s paper collections | Sci-napse`} />
          <meta property="og:title" content={`${member.name}'s paper collections | Sci-napse`} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://scinapse.io/collections/users/${member.id}/collections`} />
        </Helmet>
      );
    }
  };
}

export default connect(mapStateToProps)(UserCollections);
