import React from 'react';
import Icon from '../../icons';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./findAtLibraryDialog.scss');

const SuccessRequestContext: React.FC = () => {
  useStyles(s);

  return (
    <div className={s.formWrapper}>
      <div className={s.completeWrapper}>
        <Icon icon="COMPLETE" className={s.completeIcon} />
        <div className={s.title}>SUCCESS</div>
        <div className={s.subTitle}>
          Your request is a bridge<br />between Scinapse and the institution.
          <div className={s.contentDivider} />
          There are currently <b className={s.highLightContext}>N</b> requests<br />being received for the institution.<br />
        </div>
      </div>
    </div>
  );
};

export default SuccessRequestContext;
