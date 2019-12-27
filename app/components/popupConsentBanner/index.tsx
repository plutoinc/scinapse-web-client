import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Button } from '@pluto_network/pluto-design-elements';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./popupConsentBanner.scss');

const ACCEPT_COOKIE_KEY = 'a_c';

type AcceptAnswer = 'true' | 'false';

const PopupConsentBanner: React.FC = () => {
  useStyles(s);
  const [acceptCookie, setAcceptCookie] = useState<AcceptAnswer>(
    (Cookies.get(ACCEPT_COOKIE_KEY) as AcceptAnswer) || 'false'
  );

  useEffect(() => {
    setAcceptCookie((Cookies.get(ACCEPT_COOKIE_KEY) as AcceptAnswer) || 'false');
  }, []);

  if (acceptCookie === 'true') return null;

  return (
    <div className={s.bannerWrapper}>
      <div className={s.bannerText}>
        <div className={s.title}>This website uses cookies.</div>
        <div className={s.context}>
          We use cookies to improve your online experience. By continuing to use our website we assume you agree to the
          placement of these cookies.<br />
          To learn more, you can find in our{' '}
          <a className={s.link} href="https://scinapse.io/privacy-policy">
            Privacy Policy.
          </a>
        </div>
      </div>
      <div className={s.bannerButton}>
        <Button
          elementType="button"
          onClick={() => {
            setAcceptCookie('true');
            Cookies.set(ACCEPT_COOKIE_KEY, 'true', { expires: 365 });
          }}
        >
          Accept
        </Button>
      </div>
    </div>
  );
};

export default PopupConsentBanner;
