import * as React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { withStyles } from "../../helpers/withStylesHelper";
import Status from "../common/status";
const styles = require("./errorPage.scss");

interface ErrorPageProps extends RouteComponentProps<null> {
  errorNum?: number;
}

@withStyles<typeof ErrorPage>(styles)
class ErrorPage extends React.PureComponent<ErrorPageProps> {
  public render() {
    const { errorNum } = this.props;
    const firstNumber = errorNum ? parseInt(String(errorNum).slice(0, 1), 10) : 404;

    let errorContent: string;
    switch (firstNumber) {
      case 4:
        if (errorNum === 404) {
          errorContent = "page not found";
        } else {
          errorContent = `${errorNum} request error`;
        }
        break;
      case 5:
        errorContent = "server error";
        break;
      default:
        errorContent = "page not found";
    }

    return (
      <Status code={errorNum || 404}>
        <div className={styles.errorPageContainer}>
          <div className={styles.errorNum}>{errorNum || 404}</div>
          <div className={styles.errorContent}>{errorContent}</div>
          <div onClick={this.handleGoBack} className={styles.goBackButton}>
            Go Back
          </div>
          <Link to="/" className={styles.homeButton}>
            Home
          </Link>
        </div>
      </Status>
    );
  }

  private handleGoBack = () => {
    const { history } = this.props;

    history.goBack();
  };
}

export default withRouter(ErrorPage);
