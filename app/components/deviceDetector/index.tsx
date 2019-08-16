import * as React from 'react';
import { throttle, Cancelable } from 'lodash';
import { connect } from 'react-redux';
import EnvChecker from '../../helpers/envChecker';
import UserAgentHelper from '../../helpers/userAgentHelper';
import { AppState } from '../../reducers';
import { UserDevice, setDeviceType } from '../layouts/reducer';

const MOBILE_WIDTH = 768;
const TABLET_WIDTH = 1024;

const mapStateToProps = (state: AppState) => {
  return {
    layout: state.layout,
  };
};
const mapDispatchToProps = { setDeviceType };

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
class DeviceDetector extends React.Component<Props> {
  private throttledHandlingWindowSizeChange: (() => void) & Cancelable;

  public constructor(props: Props) {
    super(props);

    this.throttledHandlingWindowSizeChange = throttle(this.handleWindowSizeChange, 300);
  }

  public componentDidMount() {
    if (!EnvChecker.isOnServer()) {
      const device = UserAgentHelper.getDevice();

      if (device && device.type === 'mobile') {
        this.props.setDeviceType({ userDevice: UserDevice.MOBILE });
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
    return null;
  }

  private handleWindowSizeChange = () => {
    const { layout, setDeviceType } = this.props;

    if (!EnvChecker.isOnServer()) {
      if (document.documentElement) {
        const currentWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

        if (currentWidth < MOBILE_WIDTH && layout.userDevice !== UserDevice.MOBILE) {
          setDeviceType({ userDevice: UserDevice.MOBILE });
        } else if (
          currentWidth >= MOBILE_WIDTH &&
          currentWidth < TABLET_WIDTH &&
          layout.userDevice !== UserDevice.TABLET
        ) {
          setDeviceType({ userDevice: UserDevice.TABLET });
        } else if (currentWidth >= TABLET_WIDTH && layout.userDevice !== UserDevice.DESKTOP) {
          setDeviceType({ userDevice: UserDevice.DESKTOP });
        }
      }
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceDetector);
