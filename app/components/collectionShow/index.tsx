import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUser } from "../../model/currentUser";
const styles = require("./collectionShow.scss");

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser
  };
}

export interface CollectionShowProps
  extends RouteComponentProps<{ paperId: string }> {
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
}

@withStyles<typeof CollectionShow>(styles)
class CollectionShow extends React.PureComponent<CollectionShowProps, {}> {
  public render() {
    return <div className={styles.container}>Hello Collection Show</div>;
  }
}

export default connect(mapStateToProps)(withRouter(CollectionShow));
