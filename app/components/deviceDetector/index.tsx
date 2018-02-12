import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import EnvChecker from "../../helpers/envChecker";
import UserAgentHelper from "../../helpers/userAgentHelper";
import { IAppState } from "../../reducers";
import { ILayoutStateRecord } from "../layouts/records";
import { setDeviceToMobile } from "../layouts/actions";

function mapStateToProps(state: IAppState) {
  return {
    layout: state.layout,
  };
}

interface DeviceDetectorProps extends DispatchProp<{ layout: ILayoutStateRecord }> {
  layout: ILayoutStateRecord;
}

class DeviceDetector extends React.PureComponent<DeviceDetectorProps, {}> {
  public componentDidMount() {
    // TODO: Add window resize event listener
    if (!EnvChecker.isServer()) {
      const { dispatch } = this.props;
      const device = UserAgentHelper.getDevice();

      if (device && device.type === "mobile") {
        dispatch(setDeviceToMobile());
      }
    }
  }

  public componentWillUnmount() {
    if (!EnvChecker.isServer()) {
      // TODO: remove window resize event listener
    }
  }

  public render() {
    return <span />;
  }
}

export default connect(mapStateToProps)(DeviceDetector);
