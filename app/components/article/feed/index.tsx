import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IArticleFeedStateRecord } from "./records";
import * as Actions from "./actions";
import { IAppState } from "../../../reducers";
import Dialog from "material-ui/Dialog";
import SignIn from "../../auth/signIn";
const styles = require("./feed.scss");

export interface IArticleFeedContainerProps {
  dispatch: Dispatch<any>;
  articleFeedState: IArticleFeedStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    articleFeedState: state.articleFeed,
  };
}

class ArticleFeed extends React.PureComponent<IArticleFeedContainerProps, null> {
  private toggleModal = () => {
    const { dispatch } = this.props;
    dispatch(Actions.toggleModal());
  };
  render() {
    const { articleFeedState } = this.props;
    return (
      <div>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <h1>Article Fe,ed</h1>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <Dialog
          open={articleFeedState.isModalOpen}
          modal={false}
          onRequestClose={this.toggleModal}
          bodyStyle={styles.dialogContent}
        >
          <SignIn />
        </Dialog>
        <button onClick={this.toggleModal}>Open Dialog</button>
      </div>
    );
  }
}
export default connect(mapStateToProps)(ArticleFeed);
