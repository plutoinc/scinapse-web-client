import * as React from "react";
// import Modal from "react-modal";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IArticleFeedStateRecord } from "./records";
import * as Actions from "./actions";
import { IAppState } from "../../../reducers";

export interface IArticleFeedContainerProps {
  dispatch: Dispatch<any>;
  ArticleFeedState: IArticleFeedStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    ArticleFeedState: state.articleFeed
  };
}

class ArticleFeed extends React.PureComponent<
  IArticleFeedContainerProps,
  null
> {
  private toggleModal = () => {
    const { dispatch } = this.props;
    dispatch(Actions.toggleModal());
  };
  render() {
    return (
      <div>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <button onClick={this.toggleModal} />
      </div>
    );
  }
}
export default connect(mapStateToProps)(ArticleFeed);
