import * as React from "react";
import { denormalize } from "normalizr";
import { connect, Dispatch } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { AppState } from "../../reducers";
import { AuthorShowState } from "./reducer";
import AuthorShow, { AuthorShowProps } from "../../components/authorShow";
import ConnectedAuthorShow, { ConnectedAuthorShowPageProps } from "../../components/connectedAuthor";
import { Configuration } from "../../reducers/configuration";
import { fetchAuthorShowPageData } from "./sideEffect";
import { CurrentUser } from "../../model/currentUser";
import { authorSchema, Author } from "../../model/author/author";
import { Paper, paperSchema } from "../../model/paper";
import { LayoutState } from "../../components/layouts/records";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";

export interface AuthorShowMatchParams {
  authorId: string;
}

export interface HandleAuthorClaim {
  authorId: number;
}

export interface AuthorShowPageProps extends RouteComponentProps<AuthorShowMatchParams> {
  layout: LayoutState;
  author: Author | undefined;
  coAuthors: Author[];
  papers: Paper[];
  authorShow: AuthorShowState;
  configuration: Configuration;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
}

function isSafeAuthorShowProps(props: AuthorShowPageProps): props is ConnectedAuthorShowPageProps | AuthorShowProps {
  return !!props.author;
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    authorShow: state.authorShow,
    author: denormalize(state.authorShow.authorId, authorSchema, state.entities),
    coAuthors: denormalize(state.authorShow.coAuthorIds, [authorSchema], state.entities),
    papers: denormalize(state.authorShow.paperIds, [paperSchema], state.entities),
    configuration: state.configuration,
    currentUser: state.currentUser,
  };
}

class AuthorShowContainer extends React.PureComponent<AuthorShowPageProps> {
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
        currentUser
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
        currentUser
      );
    }
  }

  public render() {
    const { author, location } = this.props;

    if (!author) {
      // TODO: Add 404 page
      return null;
    }

    const queryParams = getQueryParamsObject(location.search);
    const isTestMode = queryParams.cony === "true";

    if (isSafeAuthorShowProps(this.props) && !author.isLayered) {
      return <AuthorShow {...this.props} isTestMode={isTestMode} />;
    } else if (isSafeAuthorShowProps(this.props) && author.isLayered) {
      return <ConnectedAuthorShow {...this.props} />;
    }

    return null;
  }
}

export default connect(mapStateToProps)(AuthorShowContainer);
