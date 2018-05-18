import * as React from "react";
import { denormalize } from "normalizr";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { AuthorShowState } from "./reducer";
import { ConfigurationRecord } from "../../reducers/configuration";
import { fetchAuthorShowPageData } from "./sideEffect";
import { CurrentUserRecord } from "../../model/currentUser";
import { authorSchema, Author } from "../../model/author/author";
import { Paper, paperSchema } from "../../model/paper";
const styles = require("./authorShow.scss");

export interface AuthorShowMatchParams {
  authorId: string;
}

export interface AuthorShowPageProps
  extends DispatchProp<AuthorShowMappedState>,
    RouteComponentProps<AuthorShowMatchParams> {
  author: Author;
  coAuthors: Author[];
  papers: Paper[];
  authorShow: AuthorShowState;
  configuration: ConfigurationRecord;
  currentUser: CurrentUserRecord;
}

export interface AuthorShowMappedState {
  authorShow: AuthorShowState;
  configuration: ConfigurationRecord;
  currentUser: CurrentUserRecord;
}

function mapStateToProps(state: AppState) {
  return {
    authorShow: state.authorShow,
    author: denormalize(state.authorShow.authorId, authorSchema, state.entities),
    coAuthors: denormalize(state.authorShow.coAuthorIds, [authorSchema], state.entities),
    papers: denormalize(state.authorShow.paperIds, [paperSchema], state.entities),
    configuration: state.configuration,
    currentUser: state.currentUser,
  };
}

@withStyles<typeof AuthorShowPage>(styles)
class AuthorShowPage extends React.PureComponent<AuthorShowPageProps, {}> {
  public componentDidMount() {
    const { dispatch, location, match, configuration, currentUser } = this.props;
    const notRenderedAtServerOrJSAlreadyInitialized = !configuration.initialFetched || configuration.clientJSRendered;

    if (notRenderedAtServerOrJSAlreadyInitialized) {
      fetchAuthorShowPageData(
        {
          dispatch,
          match,
          pathname: location.pathname,
        },
        currentUser,
      );
    }
  }

  public componentWillReceiveProps(nextProps: AuthorShowPageProps) {
    const { match, dispatch, location, currentUser } = nextProps;

    if (this.props.match.params.authorId !== nextProps.match.params.authorId) {
      fetchAuthorShowPageData(
        {
          dispatch,
          match,
          pathname: location.pathname,
        },
        currentUser,
      );
    }
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
