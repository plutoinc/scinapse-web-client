import * as React from "react";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUser } from "../../model/currentUser";
import { Dispatch, connect } from "react-redux";
import { AppState } from "../../reducers";
import { blockUnverifiedUser, AUTH_LEVEL } from "../../helpers/checkAuthDialog";
const styles = require("./admin.scss");

const BLOG_SCRIBER_API_HOST = "https://7hnqfzk1r6.execute-api.us-east-1.amazonaws.com/prod/blogLinks";

export interface BlogLink {
  id: string;
  link: string;
  active: boolean;
  startTime?: Date[];
  endTime?: Date[];
  createdAt?: Date;
  updatedAt?: Date;
  ogImageUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
}

interface AdminComponentProps {
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
}

interface AdminComponentState {
  isLoading: boolean;
  blogLink: string;
  blogLinks: BlogLink[];
  adminKey: string;
}

@withStyles<typeof AdminComponent>(styles)
class AdminComponent extends React.PureComponent<AdminComponentProps, AdminComponentState> {
  public constructor(props: AdminComponentProps) {
    super(props);

    this.state = {
      isLoading: false,
      blogLink: "",
      blogLinks: [],
      adminKey: "",
    };
  }

  public async componentDidMount() {
    this.handleClickReload();
  }

  public render() {
    const { blogLink, adminKey, blogLinks } = this.state;

    if (!this.checkAuth()) {
      return (
        <div className={styles.errorPageContainer}>
          <div className={styles.errorTitle}>WARNING</div>
          <div className={styles.errorContent}>You are not verified user.</div>
        </div>
      );
    }

    return (
      <div style={{ marginTop: "61px" }}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Yoonji's Space</h1>
            <p>
              Add Link and manage the promotion.<br />
              Promotion will continue for 7 days.
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.blogLinkInputSection}>
            <TextField
              className={styles.blogLinkInput}
              label="ADD BLOG LINK"
              value={blogLink}
              onChange={this.handleChange("blogLink")}
              margin="none"
              variant="outlined"
            />
            <button className={styles.blogLinkAddButton} onClick={this.handleClickAddLink}>
              {this.getLoadingScene("Add Link")}
            </button>
          </div>
          <div className={styles.adminKeyInputSection}>
            <TextField
              className={styles.adminKeyInput}
              label="ADMIN KEY"
              value={adminKey}
              type="password"
              onChange={this.handleChange("adminKey")}
              margin="none"
              variant="outlined"
            />
            <button className={styles.pageReloadButton} onClick={this.handleClickReload}>
              {this.getLoadingScene("Reload")}
            </button>
          </div>
          <Paper
            style={{
              overflowX: "auto",
              marginTop: "24px",
            }}
          >
            <Table style={{ textAlign: "center" }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="dense">No.</TableCell>
                  <TableCell padding="dense">Link</TableCell>
                  <TableCell padding="dense">Running ({this.getRunningCount()})</TableCell>
                  <TableCell padding="dense">Start Time</TableCell>
                  <TableCell padding="dense">End Time</TableCell>
                  <TableCell padding="dense">Console</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blogLinks.map((blogInfo, index) => {
                  return (
                    <TableRow key={blogInfo.id}>
                      <TableCell padding="dense" component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell
                        padding="dense"
                        className={styles.linkTableCell}
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "600px",
                        }}
                      >
                        <a href={blogInfo.link} rel="noopener nofollow" target="_blank">
                          {blogInfo.ogTitle}
                        </a>
                      </TableCell>
                      <TableCell
                        style={{
                          color: "rgb(40, 84, 255)",
                          fontWeight: 500,
                        }}
                        padding="dense"
                      >
                        {blogInfo.active ? "🔵 Running" : ""}
                      </TableCell>
                      <TableCell padding="dense">
                        {blogInfo.startTime ? blogInfo.startTime[blogInfo.startTime.length - 1] : "N/A"}
                      </TableCell>
                      <TableCell padding="dense">
                        {blogInfo.endTime && !blogInfo.active ? blogInfo.endTime[blogInfo.endTime.length - 1] : "N/A"}
                      </TableCell>
                      <TableCell padding="dense">
                        {blogInfo.active ? (
                          <button
                            className={styles.stopButton}
                            onClick={() => {
                              this.handleClickStatusButton(blogInfo.id);
                            }}
                          >
                            {this.getLoadingScene("🛑 STOP")}
                          </button>
                        ) : (
                          <button
                            className={styles.startButton}
                            onClick={() => {
                              this.handleClickStatusButton(blogInfo.id);
                            }}
                          >
                            {this.getLoadingScene("🔵 START")}
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    );
  }

  private getRunningCount = () => {
    const { blogLinks } = this.state;
    let runningCount = 0;

    if (!blogLinks) {
      return runningCount;
    }

    blogLinks.map(blogInfo => {
      if (blogInfo.active) {
        runningCount++;
      }
    });

    return runningCount;
  };

  private getLoadingScene = (buttonContent: string) => {
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <div className={styles.spinnerWrapper}>
          <CircularProgress className={styles.loadingSpinner} disableShrink={true} size={14} thickness={4} />
        </div>
      );
    }
    return buttonContent;
  };

  private handleChange = (fieldName: string) => (event: any) => {
    const newInput = event.currentTarget.value;
    this.setState(prevState => ({ ...prevState, [fieldName]: newInput }));
  };

  private handleClickStatusButton = async (id: string) => {
    const { adminKey, blogLinks } = this.state;
    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      const res = await axios.put(
        BLOG_SCRIBER_API_HOST,
        {
          id: id,
        },
        { params: { key: adminKey } }
      );

      const changeStatusBlogInfoId = blogLinks.findIndex(blogInfo => blogInfo.id === id);
      blogLinks[changeStatusBlogInfoId] = res.data.link;

      this.setState({ blogLinks: blogLinks, isLoading: false });
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  private handleClickAddLink = async () => {
    const { adminKey, blogLinks } = this.state;
    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      const res = await axios.post(
        BLOG_SCRIBER_API_HOST,
        {
          link: this.state.blogLink,
        },
        { params: { key: adminKey } }
      );

      const addedBlogInfo = res.data.link;
      blogLinks.push(addedBlogInfo);

      this.setState({ blogLinks: blogLinks, isLoading: false });
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isLoading: false, blogLink: "" }));
    }
  };

  private handleClickReload = async () => {
    try {
      if (await blockUnverifiedUser({ authLevel: AUTH_LEVEL.VERIFIED, actionArea: "unknown", actionLabel: "admin" })) {
        throw new Error();
      }

      this.setState(prevState => ({ ...prevState, isLoading: true }));
      const res = await axios.get(BLOG_SCRIBER_API_HOST, {
        params: { key: this.state.adminKey },
      });
      this.setState({ blogLinks: res.data.blogList, isLoading: false });
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  private checkAuth = () => {
    const { currentUser } = this.props;

    const emailArr = currentUser.email.split("@");
    const emailHost = emailArr[emailArr.length - 1];
    return currentUser.isLoggedIn && currentUser.emailVerified && emailHost === "pluto.network";
  };
}

const mapStateToProps = (state: AppState) => {
  return {
    currentUser: state.currentUser,
  };
};

export default connect(mapStateToProps)(AdminComponent);
