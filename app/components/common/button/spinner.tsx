import React from 'react';
import classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
import { ButtonSize } from './types';

const s = require('./spinner.scss');

interface ButtonSpinnerProps {
  color: string;
  size: ButtonSize;
  className?: string;
}
const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({ className, size, color = 'white' }) => {
  return (
    <div className={s.wrapper}>
      <div
        className={classNames({
          [s['lds-ring']]: true,
          className: !!className,
          [s.mediumRing]: size === 'medium',
          [s.largeRing]: size === 'large',
        })}
      >
        <div
          style={{
            borderColor: `${color} transparent transparent transparent`,
          }}
        />
        <div
          style={{
            borderColor: `${color} transparent transparent transparent`,
          }}
        />
        <div
          style={{
            borderColor: `${color} transparent transparent transparent`,
          }}
        />
        <div
          style={{
            borderColor: `${color} transparent transparent transparent`,
          }}
        />
      </div>
    </div>
  );
};

export default withStyles<typeof ButtonSpinner>(s)(ButtonSpinner);
