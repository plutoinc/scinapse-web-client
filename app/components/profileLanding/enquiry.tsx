import React, { FC } from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
const s = require('./profileLanding.scss');

const ProfileLandingEnquiry: FC = () => {
  return (
    <div className={s.wrapper}>
      <h1 className={s.title}>We're sorry.</h1>
      <div className={s.infoWrapper}>
        <div>
          <div className={s.information}>
            We cannot process your request at this time. Please make sure you access the page with the proper affiliation code.
      </div>
          <div className={s.subInformation}>
            For any other inquiries, send us an <a href="mailto:team@pluto.network"><i>email</i></a>.
      </div>
        </div>
        <img className={s.bannerImage} src="//assets.scinapse.io/images/researcher.png" alt="researcher image" />
      </div>
    </div>
  );
};

export default withStyles<typeof ProfileLandingEnquiry>(s)(ProfileLandingEnquiry);
