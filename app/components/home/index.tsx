import * as React from "react";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { RaisedButton } from "material-ui";

interface IHomeComponentProps extends InjectedIntlProps {}

class HomeComponent extends React.PureComponent<IHomeComponentProps, null> {
  render() {
    const { intl } = this.props;

    return (
      <div>
        <h1>{intl.formatMessage({ id: "hello" })} Pluto</h1>
        <h1>{intl.formatMessage({ id: "hello" })} Pluto</h1>
        <h1>{intl.formatMessage({ id: "hello" })} Pluto</h1>
        <h1>{intl.formatMessage({ id: "hello" })} Pluto</h1>
        <h1>{intl.formatMessage({ id: "hello" })} Pluto</h1>
        <h1>{intl.formatMessage({ id: "hello" })} Pluto</h1>
        <h1>{intl.formatMessage({ id: "hello" })} Pluto</h1>
        <RaisedButton label="Default" />
      </div>
    );
  }
}

export default injectIntl(HomeComponent);
