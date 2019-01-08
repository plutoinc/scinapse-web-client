import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { debounce } from "lodash";
import * as Cookies from "js-cookie";
import MenuItem from "@material-ui/core/MenuItem";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import * as addDays from "date-fns/add_days";
import * as isAfter from "date-fns/is_after";
import TopToastBar from "../topToastBar";
import BubblePopover from "../common/bubblePopover";
import { AppState } from "../../reducers";
import Icon from "../../icons";
import { signOut } from "../auth/actions";
import * as Actions from "./actions";
import { openSignIn, openSignUp } from "../dialog/actions";
import { trackAction, trackDialogView, trackAndOpenLink, trackEvent } from "../../helpers/handleGA";
import { handleSearchPush } from "../articleSearch/actions";
import { HeaderProps } from "./types/header";
import { withStyles } from "../../helpers/withStylesHelper";
import EnvChecker from "../../helpers/envChecker";
import { HOME_PATH } from "../../routes";
import { UserDevice } from "./records";
import ActionTicketManager from "../../helpers/actionTicketManager";
import { getCurrentPageType } from "../locationListener";
import InputWithSuggestionList from "../common/InputWithSuggestionList";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";
import SafeURIStringHandler from "../../helpers/safeURIStringHandler";
import { RawQueryParams } from "../articleSearch";
const styles = require("./header.scss");

const HEADER_BACKGROUND_START_HEIGHT = 10;
const LAST_UPDATE_DATE = "2018-09-28T11:14:57.119Z";
let ticking = false;

function mapStateToProps(state: AppState) {
  return {
    currentUserState: state.currentUser,
    layoutState: state.layout,
    articleSearchState: state.articleSearch,
  };
}

interface HeaderStates {
  isTop: boolean;
  isUserDropdownOpen: boolean;
  userDropdownAnchorElement: HTMLElement | null;
  openTopToast: boolean;
}

@withStyles<typeof Header>(styles)
class Header extends React.PureComponent<HeaderProps, HeaderStates> {
  private userDropdownAnchorRef: HTMLElement | null;

  constructor(props: HeaderProps) {
    super(props);

    this.state = {
      isTop: true,
      isUserDropdownOpen: false,
      userDropdownAnchorElement: this.userDropdownAnchorRef,
      openTopToast: false,
    };
  }

  public componentDidMount() {
    if (!EnvChecker.isOnServer()) {
      window.addEventListener("scroll", this.handleScrollEvent, { passive: true });
      this.checkTopToast();
    }
  }

  public componentWillUnmount() {
    if (!EnvChecker.isOnServer()) {
      window.removeEventListener("scroll", this.handleScrollEvent);
    }
  }

  public render() {
    const navClassName = this.getNavbarClassName();

    return (
      <nav className={`${navClassName} mui-fixed`}>
        <div className={styles.headerContainer}>
          {this.getHeaderLogo()}
          <div className={styles.leftBox}>
            <a
              onClick={() => {
                trackAndOpenLink("updates-in-header");
              }}
              href="https://www.notion.so/pluto/Scinapse-updates-6a05160afde44ba1a6ed312899c23dae"
              target="_blank"
              className={styles.link}
            >
              Updates
            </a>
            <a
              onClick={() => {
                trackAndOpenLink("blog-in-header");
              }}
              href="https://medium.com/pluto-network"
              target="_blank"
              className={styles.link}
            >
              Blog
            </a>
            <a
              onClick={() => {
                trackAndOpenLink("FAQ-in-header");
              }}
              href="https://www.notion.so/pluto/Frequently-Asked-Questions-4b4af58220aa4e00a4dabd998206325c"
              target="_blank"
              className={styles.link}
            >
              FAQ
            </a>
          </div>
          {this.getSearchFormContainer()}
          {this.getHeaderButtons()}
        </div>
        {this.getToastBar()}
      </nav>
    );
  }

  private checkTopToast = () => {
    const old = new Date(LAST_UPDATE_DATE);
    const comparisonDate = addDays(old, 3);
    const now = new Date();
    const updateIsStaled = isAfter(now, comparisonDate);
    const alreadyOpenedTopToast = !!Cookies.get("alreadyOpenedTopToast");
    const shouldOpenToast = !updateIsStaled && !alreadyOpenedTopToast;

    if (shouldOpenToast) {
      trackEvent({
        category: "Top Toast Action",
        action: "Open Update Top Toast",
      });
      this.setState(prevState => ({
        ...prevState,
        openTopToast: true,
      }));
    }
  };

  private getToastBar = () => {
    const { openTopToast } = this.state;

    if (openTopToast) {
      return <TopToastBar onClose={this.handleCloseTopToast} />;
    }
    return null;
  };

  private handleCloseTopToast = () => {
    Cookies.set("alreadyOpenedTopToast", "1", { expires: 3 });
    this.setState(prevState => ({ ...prevState, openTopToast: false }));
  };

  private getNavbarClassName = () => {
    const { location } = this.props;

    if (location.pathname !== HOME_PATH) {
      if (this.state.isTop) {
        return styles.navbar;
      } else {
        return `${styles.navbar} ${styles.scrolledNavbar}`;
      }
    } else {
      if (this.state.isTop) {
        return `${styles.navbar} ${styles.searchHomeNavbar}`;
      } else {
        return `${styles.navbar} ${styles.scrolledNavbar} ${styles.searchHomeNavbar}`;
      }
    }
  };

  private handleScrollEvent = () => {
    if (!ticking) {
      requestAnimationFrame(this.updateIsTopState);
    }

    ticking = true;
  };

  private updateIsTopState = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (scrollTop < HEADER_BACKGROUND_START_HEIGHT) {
      this.setState({
        isTop: true,
      });
    } else {
      this.setState({
        isTop: false,
      });
    }

    ticking = false;
  };

  private changeSearchInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (value.length > 1) {
      this.delayedGetKeywordCompletion(value);
    }
  };

  private getKeywordCompletion = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.getKeywordCompletion(searchInput));
  };

  // tslint:disable-next-line:member-ordering
  private delayedGetKeywordCompletion = debounce(this.getKeywordCompletion, 200);

  private handleSearchPush = (query: string) => {
    const { dispatch } = this.props;

    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: "fire",
      actionArea: "topBar",
      actionTag: "query",
      actionLabel: query,
    });

    dispatch(handleSearchPush(query));
  };

  private getHeaderLogo = () => {
    const { location, layoutState } = this.props;
    const isNotHome = location.pathname !== HOME_PATH;

    if (layoutState.userDevice !== UserDevice.DESKTOP && isNotHome) {
      return (
        <Link to="/" className={styles.headerLogoMark}>
          <Icon icon="SCINAPSE_LOGO_SMALL" />
        </Link>
      );
    } else {
      return (
        <Link to="/" onClick={() => trackAction("/", "headerLogo")} className={styles.headerLogo}>
          <Icon icon="SCINAPSE_LOGO" />
        </Link>
      );
    }
  };

  private getSearchFormContainer = () => {
    const { location, layoutState } = this.props;

    const isShowSearchFormContainer = location.pathname !== HOME_PATH;
    const rawQueryParamsObj: RawQueryParams = getQueryParamsObject(location.search);
    const query = SafeURIStringHandler.decode(rawQueryParamsObj.query || "");

    return (
      <div style={!isShowSearchFormContainer ? { visibility: "hidden" } : {}} className={styles.searchFormContainer}>
        <div className={styles.searchInputBoxWrapper} tabIndex={0}>
          <InputWithSuggestionList
            defaultValue={query}
            onChange={this.changeSearchInput}
            placeholder="Search papers by title, author, doi or keyword"
            handleSubmit={this.handleSearchPush}
            suggestionList={layoutState.completionKeywordList.map(keyword => keyword.keyword)}
            wrapperClassName={styles.searchWrapper}
            style={{
              display: "flex",
              width: "100%",
              height: "44px",
              border: 0,
              borderRadius: "4px",
              paddingLeft: "16px",
              backgroundColor: "white",
              overflow: "hidden",
              alignItems: "center",
            }}
            listWrapperStyle={{
              boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 8px 1px",
            }}
            listItemStyle={{
              height: "44px",
              lineHeight: "44px",
              padding: "0 18px",
            }}
            iconNode={<Icon icon="SEARCH_ICON" className={styles.searchIcon} />}
          />
        </div>
      </div>
    );
  };

  private handleClickSignOut = () => {
    const { dispatch } = this.props;

    dispatch(signOut());
    this.handleRequestCloseUserDropdown();
  };

  private handleOpenSignIn = () => {
    const { dispatch } = this.props;

    dispatch(openSignIn());
  };

  private handleOpenSignUp = () => {
    const { dispatch } = this.props;

    dispatch(openSignUp());
  };

  private handleToggleUserDropdown = () => {
    this.setState({
      userDropdownAnchorElement: this.userDropdownAnchorRef,
      isUserDropdownOpen: !this.state.isUserDropdownOpen,
    });
  };

  private handleRequestCloseUserDropdown = () => {
    this.setState({
      isUserDropdownOpen: false,
    });
  };

  private userDropdownMenuItems = () => {
    const { currentUserState } = this.props;

    return (
      <div className={styles.menuItems}>
        {currentUserState.is_author_connected ? (
          <MenuItem classes={{ root: styles.profileButton }}>
            <Link
              className={styles.buttonOnLink}
              onClick={this.handleRequestCloseUserDropdown}
              to={`/authors/${currentUserState.author_id}?beta=true`}
            >
              Profile
            </Link>
          </MenuItem>
        ) : null}
        <MenuItem classes={{ root: styles.collectionButton }}>
          <Link
            className={styles.buttonOnLink}
            onClick={this.handleRequestCloseUserDropdown}
            to={`/users/${currentUserState.id}/collections`}
          >
            Collection
          </Link>
        </MenuItem>
        <MenuItem classes={{ root: styles.signOutButton }} onClick={this.handleClickSignOut}>
          <span className={styles.buttonText}>Sign Out</span>
        </MenuItem>
      </div>
    );
  };

  private getUserDropdown = () => {
    const { currentUserState } = this.props;

    const firstCharacterOfUsername = currentUserState.firstName.slice(0, 1).toUpperCase();

    return (
      <div className={styles.rightBox}>
        <div>
          <div
            className={styles.userDropdownChar}
            ref={el => (this.userDropdownAnchorRef = el)}
            onClick={this.handleToggleUserDropdown}
          >
            {firstCharacterOfUsername}
          </div>
          <BubblePopover
            open={this.state.isUserDropdownOpen}
            anchorEl={this.state.userDropdownAnchorElement!}
            placement="bottom-end"
            popperOptions={{
              positionFixed: true,
            }}
          >
            <ClickAwayListener onClickAway={this.handleRequestCloseUserDropdown}>
              {this.userDropdownMenuItems()}
            </ClickAwayListener>
          </BubblePopover>
        </div>
      </div>
    );
  };

  private getHeaderButtons = () => {
    const { currentUserState } = this.props;
    const { isLoggedIn } = currentUserState;

    if (!isLoggedIn) {
      return (
        <div className={styles.rightBox}>
          <div
            onClick={() => {
              this.handleOpenSignIn();
              trackDialogView("headerSignInOpen");
              ActionTicketManager.trackTicket({
                pageType: getCurrentPageType(),
                actionType: "fire",
                actionArea: "topBar",
                actionTag: "signIn",
                actionLabel: null,
              });
            }}
            className={styles.signInButton}
          >
            Sign in
          </div>
          <div
            onClick={() => {
              this.handleOpenSignUp();
              trackDialogView("headerSignUpOpen");
              ActionTicketManager.trackTicket({
                pageType: getCurrentPageType(),
                actionType: "fire",
                actionArea: "topBar",
                actionTag: "signUp",
                actionLabel: null,
              });
            }}
            className={styles.signUpButton}
          >
            Get Started
          </div>
        </div>
      );
    } else {
      return this.getUserDropdown();
    }
  };
}

export default withRouter(connect(mapStateToProps)(Header));
