import * as React from "react";
import { goBack } from "connected-react-router";
import { connect, Dispatch } from "react-redux";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./errorPage.scss");

interface ErrorPageProps {
  dispatch: Dispatch<any>;
  errorNum?: number;
}

@withStyles<typeof ErrorPage>(styles)
class ErrorPage extends React.PureComponent<ErrorPageProps> {
  public render() {
    const { errorNum } = this.props;
    const firstNumber = errorNum ? 404 : parseInt(String(errorNum).slice(0, 1), 10);

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
      <div className={styles.errorPageContainer}>
        <div className={styles.errorNum}>{errorNum || 404}</div>
        <div className={styles.errorContent}>{errorContent}</div>
        <div onClick={this.handleGoBack} className={styles.goBackButton}>
          Go Back
        </div>
      </div>
    );
  }

  private handleGoBack = () => {
    const { dispatch } = this.props;

    dispatch!(goBack());
  };
}

export default connect()(ErrorPage);
