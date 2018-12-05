import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import ScinapseButton from "../../components/common/scinapseButton";
import { AppState } from "../../reducers";
import { MyCollectionsState } from "./reducer";
import { collectionSchema, Collection } from "../../model/collection";
import { denormalize } from "normalizr";
const styles = require("./paperShowCollectionControlButton.scss");

interface PaperShowCollectionControlButtonProps {
  myCollectionsState: MyCollectionsState;
  dispatch: Dispatch<any>;
  myCollections: Collection[] | null;
}

@withStyles<typeof PaperShowCollectionControlButton>(styles)
class PaperShowCollectionControlButton extends React.PureComponent<PaperShowCollectionControlButtonProps> {
  public render() {
    const { myCollections } = this.props;

    const saveButtonContent = (
      <div>
        <Icon className={styles.savedButtonIcon} icon={"BOOKMARK_GRAY"} />
        <span>Save</span>
      </div>
    );

    return (
      <div className={styles.buttonWrapper}>
        <li className={styles.actionItem}>
          <span className={styles.currentCollectionTitle}>
            {myCollections && myCollections.length > 0 && myCollections[0].title}
          </span>
          <ScinapseButton
            content={saveButtonContent}
            gaCategory="PaperShowCollection"
            style={{
              width: "83px",
              height: "40px",
              borderRadius: "4px",
              backgroundColor: "#3e7fff",
              fontSize: "16px",
              fontWeight: 500,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            onClick={this.handleClickSaveButton}
          />
        </li>
      </div>
    );
  }

  private handleClickSaveButton = () => {};
}

const mapStateToProps = (appState: AppState) => {
  return {
    myCollectionsState: appState.myCollections,
    myCollections: denormalize(appState.myCollections.collectionIds, [collectionSchema], appState.entities),
  };
};

export default connect(mapStateToProps)(PaperShowCollectionControlButton);
