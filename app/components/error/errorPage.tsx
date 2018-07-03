import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { goBack } from "connected-react-router";
import { connect, DispatchProp } from "react-redux";
import Icon from "../../icons";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./errorPage.scss");

interface ErrorPageParams
  extends RouteComponentProps<ErrorPageParams>,
    DispatchProp<null> {
  errorNum?: number;
}

function mapStateToProps() {
  return {};
}

@withStyles<typeof ErrorPage>(styles)
class ErrorPage extends React.Component<ErrorPageParams, {}> {
  public shouldComponentUpdate(nextProps: ErrorPageParams) {
    const beforeErrorNum = this.props.match.params.errorNum;
    const afterErrorNum = nextProps.match.params.errorNum;

    return beforeErrorNum !== afterErrorNum;
  }

  public render() {
    const paramErrorNum: string = this.props.match.params.errorNum!.toString();
    const firstNumber: number = parseInt(paramErrorNum[0], 10);

    let errorContent: string;
    let errorNum: string = paramErrorNum;

    switch (firstNumber) {
      case 4:
        if (paramErrorNum === "404") {
          errorContent = "page not found";
        } else {
          errorContent = `${paramErrorNum} request error`;
        }
        break;
      case 5:
        errorContent = "server error";
        break;
      default:
        errorNum = "404";
        errorContent = "page not found";
    }

    return (
      <div className={styles.errorPageContainer}>
        <Icon className={styles.errorBackground} icon="ERROR_BACKGROUND" />
        <div className={styles.errorNum}>{errorNum}</div>
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

export default connect(mapStateToProps)(ErrorPage);
