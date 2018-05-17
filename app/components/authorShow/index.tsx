import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { AuthorShowStateRecord } from "./records";
import { getAuthor, getCoAuthors } from "./actions";
const styles = require("./authorShow.scss");

export interface AuthorShowPageProps
  extends DispatchProp<AuthorShowMappedState>,
    RouteComponentProps<{ authorId: string }> {
  authorShow: AuthorShowStateRecord;
}

export interface AuthorShowMappedState {
  authorShow: AuthorShowStateRecord;
}

function mapStateToProps(state: AppState) {
  return {
    authorShow: state.authorShow,
  };
}

@withStyles<typeof AuthorShowPage>(styles)
class AuthorShowPage extends React.PureComponent<AuthorShowPageProps, {}> {
  public componentDidMount() {
    const { dispatch, match } = this.props;
    const authorId = parseInt(match.params.authorId, 10);
    dispatch(getAuthor(authorId));
    dispatch(getCoAuthors(authorId));
    // dispatch(getAuthorPapers(authorId));
  }

  public render() {
    return (
      <div className={styles.authorShowPageWrapper}>
        Hello world
        <div>Hello authors page</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(AuthorShowPage);
