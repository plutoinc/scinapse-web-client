import * as React from 'react';
import { throttle } from 'lodash';
import { useDispatch } from 'react-redux';
import UserAgentHelper from '../../helpers/userAgentHelper';
import { UserDevice, setDeviceType } from '../layouts/reducer';

const MOBILE_WIDTH = 768;
const TABLET_WIDTH = 1024;

const DeviceDetector: React.FC = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const device = UserAgentHelper.getDevice();
    if (device && device.type === 'mobile') {
      dispatch(setDeviceType({ userDevice: UserDevice.MOBILE }));
    }

    const handleWindowSizeChange = () => {
      if (document.documentElement) {
        const currentWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

        if (currentWidth < MOBILE_WIDTH) {
          dispatch(setDeviceType({ userDevice: UserDevice.MOBILE }));
        } else if (currentWidth >= MOBILE_WIDTH && currentWidth < TABLET_WIDTH) {
          dispatch(setDeviceType({ userDevice: UserDevice.TABLET }));
        } else if (currentWidth >= TABLET_WIDTH) {
          dispatch(setDeviceType({ userDevice: UserDevice.DESKTOP }));
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
