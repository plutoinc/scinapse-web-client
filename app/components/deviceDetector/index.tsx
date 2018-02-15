import * as React from "react";
import * as _ from "lodash";
import { connect, DispatchProp } from "react-redux";
import EnvChecker from "../../helpers/envChecker";
import UserAgentHelper from "../../helpers/userAgentHelper";
import { IAppState } from "../../reducers";
import { ILayoutStateRecord } from "../layouts/records";
import { setDeviceToMobile, setDeviceToDesktop } from "../layouts/actions";

const MOBILE_WIDTH = 768;

function mapStateToProps(state: IAppState) {
  return {
    layout: state.layout,
  };
}

interface DeviceDetectorProps extends DispatchProp<{ layout: ILayoutStateRecord }> {
  layout: ILayoutStateRecord;
}

class DeviceDetector extends React.PureComponent<DeviceDetectorProps, {}> {
  private handleWindowSizeChange = () => {
    const { dispatch, layout } = this.props;

    if (!EnvChecker.isServer()) {
      const currentWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      if (currentWidth < MOBILE_WIDTH && !layout.isMobile) {
        dispatch(setDeviceToMobile());
      } else if (currentWidth >= MOBILE_WIDTH && layout.isMobile) {
        dispatch(setDeviceToDesktop());
      }
    }
  };

  private throttledHandlingWindowSizeChange = _.throttle(this.handleWindowSizeChange, 300);

  public componentDidMount() {
    if (!EnvChecker.isServer()) {
      const { dispatch } = this.props;
      const device = UserAgentHelper.getDevice();

      if (device && device.type === "mobile") {
        dispatch(setDeviceToMobile());
      }

      window.addEventListener("resize", this.throttledHandlingWindowSizeChange);
    }
  }

  public componentWillUnmount() {
    if (!EnvChecker.isServer()) {
      window.removeEventListener("resize", this.throttledHandlingWindowSizeChange);
    }
  }

  public render() {
    return <span />;
  }
}

export default connect(mapStateToProps)(DeviceDetector);
