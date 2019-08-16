import * as React from 'react';
import { throttle } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import EnvChecker from '../../helpers/envChecker';
import UserAgentHelper from '../../helpers/userAgentHelper';
import { UserDevice, setDeviceType, LayoutState } from '../layouts/reducer';
import { AppState } from '../../reducers';

const MOBILE_WIDTH = 768;
const TABLET_WIDTH = 1024;

const DeviceDetector: React.FC = () => {
  const dispatch = useDispatch();
  const layout = useSelector<AppState, LayoutState>(state => state.layout);

  React.useEffect(() => {
    if (EnvChecker.isOnServer()) return;

    const device = UserAgentHelper.getDevice();
    if (device && device.type === 'mobile') {
      dispatch(setDeviceType({ userDevice: UserDevice.MOBILE }));
    }

    const handleWindowSizeChange = () => {
      if (document.documentElement) {
        const currentWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

        if (currentWidth < MOBILE_WIDTH && layout.userDevice !== UserDevice.MOBILE) {
          dispatch(setDeviceType({ userDevice: UserDevice.MOBILE }));
        } else if (
          currentWidth >= MOBILE_WIDTH &&
          currentWidth < TABLET_WIDTH &&
          layout.userDevice !== UserDevice.TABLET
        ) {
          dispatch(setDeviceType({ userDevice: UserDevice.TABLET }));
        } else if (currentWidth >= TABLET_WIDTH && layout.userDevice !== UserDevice.DESKTOP) {
          dispatch(setDeviceType({ userDevice: UserDevice.DESKTOP }));
        }
      }
    };
    const throttledHandlingWindowSizeChange = throttle(handleWindowSizeChange, 300);
    window.addEventListener('resize', throttledHandlingWindowSizeChange);
    return () => {
      if (EnvChecker.isOnServer()) return;
      window.removeEventListener('resize', throttledHandlingWindowSizeChange);
    };
  });

  return null;
};

export default DeviceDetector;
