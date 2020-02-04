import React, { FC } from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
const s = require('./profileLanding.scss');

const ProfileLandingEnquiry: FC = () => {
  return (
    <div className={s.wrapper}>
      <div>
        <h1>Enquiry Needed</h1>
        <p>Send us an email</p>
      </div>
    </div>
  );
};

export default withStyles<typeof ProfileLandingEnquiry>(s)(ProfileLandingEnquiry);
