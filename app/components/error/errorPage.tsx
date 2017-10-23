import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

interface IErrorPageParams extends RouteComponentProps<IErrorPageParams> {
  errorNum?: number;
}

class ErrorPage extends React.Component<IErrorPageParams, null> {
  public shouldComponentUpdate(nextProps: IErrorPageParams) {
    const beforeErrorNum = this.props.match.params.errorNum;
    const afterErrorNum = nextProps.match.params.errorNum;

    return beforeErrorNum !== afterErrorNum;
  }

  public render() {
    const { errorNum } = this.props.match.params;
    const firstNumber: number = parseInt(errorNum.toString()[0], 10);
    let errorContent;
    switch (firstNumber) {
      case 4:
        errorContent = "Not Found!";
        break;
      case 5:
        errorContent = "Server Error";
        break;
      default:
        errorContent = "ERROR";
    }

    return (
      <div style={{ marginTop: 75 }}>
        <h1>{errorContent}</h1>
      </div>
    );
  }
}

export default ErrorPage;
