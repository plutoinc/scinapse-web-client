import React, { FC } from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
const s = require('./profileLanding.scss');

const ProfileLandingEnquiry: FC = () => {
  return (
    <div className={s.wrapper}>
      <p>Enquiry Needed</p>
      <span>Send us an email</span>
    </div>
  )
}

export default withStyles<typeof ProfileLandingEnquiry>(s)(ProfileLandingEnquiry);
