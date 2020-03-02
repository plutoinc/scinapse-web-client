import React, { FC } from 'react';
import ImprovedFooter from '../layouts/improvedFooter';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./profileLanding.scss');

const ProfileLandingEnquiry: FC = () => {
  useStyles(s);

  return (
    <div className={s.enquiryContainer}>
      <div className={s.enquiryWrapper}>
        <div>
          <h1 className={s.title}>We're sorry.</h1>
          <div>
            <div className={s.information}>
              We cannot process your request at this time.
              <br />
              Please make sure you access the page with the proper affiliation code.
            </div>
            <div className={s.subInformation}>
              For any other inquiries, send us an{' '}
              <a href="mailto:team@pluto.network">
                <i>email</i>
              </a>
              .
            </div>
          </div>
        </div>
        <div className={s.infoWrapper}>
          <img
            className={s.enquiryBannerImage}
            src="//assets.scinapse.io/images/researcher.png"
            alt="researcher image"
          />
        </div>
      </div>
      <ImprovedFooter containerStyle={{ width: '100%', backgroundColor: 'white' }} />
    </div>
  );
};

export default ProfileLandingEnquiry;
