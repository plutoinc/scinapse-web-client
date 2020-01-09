import React from 'react';
import Icon from '../../icons';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./findInLibraryDialog.scss');

const AlreadyRequestContext: React.FC = () => {
  useStyles(s);

  return (
    <div className={s.formWrapper}>
      <div className={s.completeWrapper}>
        <Icon icon="SEND" className={s.sendIcon} />
        <div className={s.title}>IN PROGRESS</div>
        <div className={s.subTitle}>
          You have already requested the institution.<br />
          Please wait a little longer.<br />We'll let you know as soon as the institution responds.
          <div className={s.contentDivider} />
          There are currently <b className={s.highLightContext}>N</b> requests<br />being received for the institution.<br />
        </div>
      </div>
    </div>
  );
};

export default AlreadyRequestContext;
