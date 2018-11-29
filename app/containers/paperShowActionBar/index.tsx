import * as React from "react";
import { denormalize } from "normalizr";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Popover from "@material-ui/core/Popover";
import GlobalDialogManager from "../../helpers/globalDialogManager";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import { AppState } from "../../reducers";
import { collectionSchema, Collection } from "../../model/collection";
import { PaperShowActionBarState } from "./reducer";
import CollectionDropdown from "../../components/paperShow/components/collectionDropdown";
import { CurrentUser } from "../../model/currentUser";
import { trackEvent } from "../../helpers/handleGA";
import { addPaperToCollection, removePaperFromCollection } from "../../components/dialog/actions";
import { paperSchema, Paper } from "../../model/paper";
import { PostCollectionParams } from "../../api/collection";
import { postNewCollection } from "../../actions/paperShow";
import { openCollectionDropdown, closeCollectionDropdown } from "./actions";
const styles = require("./actionBar.scss");

interface PaperShowActionBarProps {
  myCollections: Collection[] | null;
  paper: Paper | null;
  paperShowActionBar: PaperShowActionBarState;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
}

@withStyles<typeof PaperShowActionBar>(styles)
class PaperShowActionBar extends React.PureComponent<PaperShowActionBarProps> {
  private collectionDivElement: HTMLDivElement | null;

  public render() {
    const { paper } = this.props;

    if (paper) {
      return (
        <div className={styles.actionBar}>
          <ul className={styles.actions}>
            <div className={styles.leftSide} />
            <div className={styles.rightSide}>
              <li className={styles.actionItem}>{this.getCitationBox()}</li>
              <li className={styles.actionItem}>
                <div
                  onClick={this.handleRequestToOpenCollectionDropdown}
                  className={styles.actionSave}
                  ref={el => (this.collectionDivElement = el)}
                >
                  <Icon icon={"BOOKMARK_GRAY"} />
                  <span>Save to Collection</span>
                </div>
                {this.getCollectionPopover()}
              </li>
            </div>
          </ul>
        </div>
      );
    }
    return null;
  }

  private getCollectionPopover = () => {
    const { paperShowActionBar, myCollections } = this.props;

    if (!myCollections) {
      return null;
    }

    return (
      <Popover
        open={paperShowActionBar.isCollectionDropdownOpen}
        anchorEl={this.collectionDivElement!}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        onClose={this.handleRequestToCloseCollectionDropdown}
        classes={{
          paper: styles.collectionDropdownPaper,
        }}
      >
        <CollectionDropdown
          isLoadingMyCollections={paperShowActionBar.isLoadingMyCollections}
          isPositingNewCollection={paperShowActionBar.isPositingNewCollection}
          myCollections={myCollections}
          handleAddingPaperToCollection={this.handleAddingPaperToCollection}
          handleRemovingPaperFromCollection={this.handleRemovingPaperFromCollection}
          handleSubmitNewCollection={this.handleSubmitNewCollection}
        />
      </Popover>
    );
  };

  private handleRequestToOpenCollectionDropdown = () => {
    const { currentUser, dispatch } = this.props;

    trackEvent({ category: "Additional Action", action: "Click [Add Collection] Button" });

    if (!currentUser.isLoggedIn) {
      return GlobalDialogManager.openSignUpDialog();
    } else if (currentUser.isLoggedIn) {
      dispatch(openCollectionDropdown());
    }
  };

  private handleRequestToCloseCollectionDropdown = () => {
    const { dispatch } = this.props;

    dispatch(closeCollectionDropdown());
  };

  private handleAddingPaperToCollection = async (collection: Collection) => {
    const { dispatch, paper } = this.props;

    if (paper) {
      await dispatch(
        addPaperToCollection({
          collection,
          paperId: paper.id,
        })
      );
      await this.getMyCollections();
    }
  };

  private handleRemovingPaperFromCollection = async (collection: Collection) => {
    const { dispatch, paper } = this.props;

    if (paper) {
      await dispatch(
        removePaperFromCollection({
          collection,
          paperIds: [paper.id],
        })
      );
      await this.getMyCollections();
    }
  };

  private handleSubmitNewCollection = async (params: PostCollectionParams) => {
    const { dispatch } = this.props;
    await dispatch(postNewCollection(params));
  };

  private getCitationBox = () => {
    const { paper } = this.props;

    if (paper && paper.id) {
      return (
        <div>
          <div
            onClick={() => {
              GlobalDialogManager.openCitationDialog(paper.id);
              trackEvent({ category: "Additional Action", action: "Click Citation Button" });
            }}
            className={styles.actionCite}
          >
            <div>
              <Icon icon={"CITATION_QUOTE"} />
              <span>Cite this paper</span>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  private getMyCollections = async () => {
    // const { dispatch, currentUser, paper } = this.props;
    // if (currentUser.isLoggedIn && paper) {
    //   try {
    //     const collectionResponse = await dispatch(getMyCollections(paper.id));
    //     if (collectionResponse && collectionResponse.result.length > 0) {
    //       collectionResponse.content.filter(obj => obj.contains_selected).map(async collection => {
    //         const response = await dispatch(getPapers(collection.id));
    //         if (response && response.result.length > 0) {
    //           this.setState({
    //             papersInCollection: [
    //               ...this.state.papersInCollection,
    //               response.entities.papersInCollection[paper.id],
    //             ],
    //           });
    //         }
    //       });
    //     }
    //   } catch (err) {
    //     console.error(`Error for fetching paper show page data`, err);
    //   }
    // }
  };
}

const mapStateToProps = (state: AppState) => {
  return {
    myCollections: denormalize(state.paperShowActionBar.myCollectionIds, [collectionSchema], state.entities),
    paperShowActionBar: state.paperShowActionBar,
    currentUser: state.currentUser,
    paper: denormalize(state.paperShow.paperId, paperSchema, state.entities),
  };
};

export default connect(mapStateToProps)(PaperShowActionBar);
