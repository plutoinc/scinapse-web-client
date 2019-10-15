import * as React from 'react';
import { throttle } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import UserAgentHelper from '../../helpers/userAgentHelper';
import { UserDevice, setDeviceType } from '../layouts/reducer';
import { AppState } from '../../reducers';

const MOBILE_WIDTH = 768;
const TABLET_WIDTH = 1024;

const DeviceDetector: React.FC = () => {
  const dispatch = useDispatch();
  const currentDevice = useSelector((state: AppState) => state.layout.userDevice);
  const lastDevice = React.useRef(currentDevice);

  React.useEffect(() => {
    const device = UserAgentHelper.getDevice();
    if (device && device.type === 'mobile') {
      dispatch(setDeviceType({ userDevice: UserDevice.MOBILE }));
    }

    const handleWindowSizeChange = () => {
      if (document.documentElement) {
        const currentWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

        if (currentWidth < MOBILE_WIDTH && lastDevice.current !== UserDevice.MOBILE) {
          dispatch(setDeviceType({ userDevice: UserDevice.MOBILE }));
          lastDevice.current = UserDevice.MOBILE;
        } else if (
          currentWidth >= MOBILE_WIDTH &&
          currentWidth < TABLET_WIDTH &&
          lastDevice.current !== UserDevice.TABLET
        ) {
          dispatch(setDeviceType({ userDevice: UserDevice.TABLET }));
          lastDevice.current = UserDevice.TABLET;
        } else if (currentWidth >= TABLET_WIDTH && lastDevice.current !== UserDevice.DESKTOP) {
          dispatch(setDeviceType({ userDevice: UserDevice.DESKTOP }));
          lastDevice.current = UserDevice.DESKTOP;
        }
      }
    };
    const throttledHandlingWindowSizeChange = throttle(handleWindowSizeChange, 400);
    window.addEventListener('resize', throttledHandlingWindowSizeChange);
    handleWindowSizeChange();
    return () => {
      window.removeEventListener('resize', throttledHandlingWindowSizeChange);
    };
  }, []);

  return null;
};

export default DeviceDetector;
