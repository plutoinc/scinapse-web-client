import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { getAuthor, getCoAuthors } from "./actions";
import { AuthorShowState } from "./records";
const styles = require("./authorShow.scss");

export interface AuthorShowPageProps
  extends DispatchProp<AuthorShowMappedState>,
    RouteComponentProps<{ authorId: string }> {
  authorShow: AuthorShowState;
}

export interface AuthorShowMappedState {
  authorShow: AuthorShowState;
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
    // const { authorShow } = this.props;

    return (
      <div className={styles.authorShowPageWrapper}>
        Hello world
        <div>Hello authors page</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(AuthorShowPage);
