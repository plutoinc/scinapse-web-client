import * as React from 'react';
import { throttle, Cancelable } from 'lodash';
import { connect, DispatchProp } from 'react-redux';
import EnvChecker from '../../helpers/envChecker';
import UserAgentHelper from '../../helpers/userAgentHelper';
import { AppState } from '../../reducers';
import { LayoutState, UserDevice } from '../layouts/records';
import { setDeviceToMobile, setDeviceToDesktop, setDeviceToTablet } from '../layouts/actions';

const MOBILE_WIDTH = 768;
const TABLET_WIDTH = 1024;

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
  };
}

interface DeviceDetectorProps extends DispatchProp {
  layout: LayoutState;
}

class DeviceDetector extends React.PureComponent<DeviceDetectorProps, {}> {
  private throttledHandlingWindowSizeChange: (() => void) & Cancelable;

  public constructor(props: DeviceDetectorProps) {
    super(props);

    this.throttledHandlingWindowSizeChange = throttle(this.handleWindowSizeChange, 300);
  }

  public componentDidMount() {
    if (!EnvChecker.isOnServer()) {
      const { dispatch } = this.props;
      const device = UserAgentHelper.getDevice();

      if (device && device.type === 'mobile') {
        dispatch!(setDeviceToMobile());
      }

      window.addEventListener('resize', this.throttledHandlingWindowSizeChange);
    }
  }

  public componentWillUnmount() {
    if (!EnvChecker.isOnServer()) {
      window.removeEventListener('resize', this.throttledHandlingWindowSizeChange);
    }
  }

  public render() {
    return <span />;
  }

  private handleWindowSizeChange = () => {
    const { dispatch, layout } = this.props;

    if (!EnvChecker.isOnServer()) {
      if (document.documentElement) {
        const currentWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

        if (currentWidth < MOBILE_WIDTH && layout.userDevice !== UserDevice.MOBILE) {
          dispatch!(setDeviceToMobile());
        } else if (
          currentWidth >= MOBILE_WIDTH &&
          currentWidth < TABLET_WIDTH &&
          layout.userDevice !== UserDevice.TABLET
        ) {
          dispatch!(setDeviceToTablet());
        } else if (currentWidth >= TABLET_WIDTH && layout.userDevice !== UserDevice.DESKTOP) {
          dispatch!(setDeviceToDesktop());
        }
      }
    }
  };
}

export default connect(mapStateToProps)(DeviceDetector);
