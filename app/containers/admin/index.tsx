import * as React from "react";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUser } from "../../model/currentUser";
import { Dispatch, connect } from "react-redux";
import { AppState } from "../../reducers";
const styles = require("./admin.scss");

interface BlogLink {
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
  blogLinks: BlogLink[];
}

@withStyles<typeof AdminComponent>(styles)
class AdminComponent extends React.PureComponent<AdminComponentProps, AdminComponentState> {
  public constructor(props: AdminComponentProps) {
    super(props);

    this.state = {
      isLoading: false,
      blogLinks: [],
    };
  }

  public async componentDidMount() {
    // fetch
    // if (!this.checkAuth()) {
    //   return null;
    // }

    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      const res = await axios.get("https://7hnqfzk1r6.execute-api.us-east-1.amazonaws.com/prod/blogLinks");
      this.setState({ blogLinks: res.data, isLoading: false });
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  }

  public render() {
    console.log(this.state);

    if (!this.checkAuth()) {
      return (
        <div>
          <span>You are not verified user.</span>
        </div>
      );
    }

    return (
      <div style={{ marginTop: "61px" }}>
        <h1>Yoonji's Space</h1>
        <Paper
          style={{
            width: "700px",
            overflowX: "auto",
          }}
        >
          <Table style={{ textAlign: "center" }}>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell align="right">Link</TableCell>
                <TableCell align="right">Running (Running count)</TableCell>
                <TableCell align="right">Start Time</TableCell>
                <TableCell align="right">End Time</TableCell>
                <TableCell align="right">Console</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {rows.map(row => {
            return (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            );
          })} */}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

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
