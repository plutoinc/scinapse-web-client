import React from 'react';
import Icon from '../../icons';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./findInLibraryDialog.scss');

const SuccessRequestContext: React.FC<{ count: number; affiliationName: string }> = ({ count, affiliationName }) => {
  useStyles(s);

  return (
    <div className={s.formWrapper}>
      <div className={s.completeWrapper}>
        <Icon icon="COMPLETE" className={s.completeIcon} />
        <div className={s.title}>SUCCESS</div>
        <div className={s.subTitle}>
          Your request is a bridge<br />between Scinapse and the institution.
          <div className={s.contentDivider} />
          There are currently <b className={s.highLightContext}>{count}</b> requests<br />being received for{' '}
          <span className={s.highLightAffiliationName}>{affiliationName}</span>.
        </div>
      </div>
    </div>
  );
};

export default SuccessRequestContext;
