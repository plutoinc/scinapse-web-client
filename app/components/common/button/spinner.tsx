import React from 'react';
import classNames from 'classnames';
import { ButtonSize } from './types';
import { withStyles } from '../../../helpers/withStylesHelper';

const s = require('./spinner.scss');

interface ButtonSpinnerProps {
  size: ButtonSize;
  className?: string;
}
const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({ className, size }) => {
  return (
    <div className={s.wrapper}>
      <div
        className={classNames({
          ['lds-ring']: true,
          className: !!className,
          [s.mediumRing]: size === 'medium',
          [s.largeRing]: size === 'large',
        })}
      >
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default withStyles<typeof ButtonSpinner>(s)(ButtonSpinner);
