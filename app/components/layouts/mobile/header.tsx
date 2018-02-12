import * as React from "react";
import { throttle } from "lodash";
import { Link } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { RouteProps } from "react-router-dom";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";
import { IHeaderMappedState } from "../types/header";
import { ICurrentUserRecord } from "../../../model/currentUser";
import { ILayoutStateRecord } from "../records";
import { IArticleSearchStateRecord } from "../../articleSearch/records";
const styles = require("./header.scss");

// const HEADER_BACKGROUND_START_HEIGHT = 10;

export interface MobileHeaderProps extends DispatchProp<IHeaderMappedState> {
  layoutState: ILayoutStateRecord;
  currentUserState: ICurrentUserRecord;
  routing: RouteProps;
  articleSearchState: IArticleSearchStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    currentUserState: state.currentUser,
    layoutState: state.layout,
    routing: state.routing,
    articleSearchState: state.articleSearch,
  };
}

export interface IHeaderSearchParams {
  query?: string;
  page?: string;
  references?: string;
  cited?: string;
}

class MobileHeader extends React.PureComponent<MobileHeaderProps, {}> {
  public componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  public render() {
    // if (searchPage) {
    // } else if (homePage) {
    // } else {
    return (
      <nav className={""}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.headerLogo}>
            <Icon icon="PAPERS_LOGO" />
          </Link>
        </div>
      </nav>
    );
    // }
  }

  private handleScrollEvent = () => {
    // const { dispatch } = this.props;
    // const top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    // if (top < HEADER_BACKGROUND_START_HEIGHT) {
    //   dispatch(Actions.reachScrollTop());
    // } else {
    //   dispatch(Actions.leaveScrollTop());
    // }
  };

  private handleScroll = throttle(this.handleScrollEvent, 100);
}

export default connect(mapStateToProps)(MobileHeader);
