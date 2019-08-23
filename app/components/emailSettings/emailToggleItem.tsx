import React from 'react';
import classNames from 'classnames';
import { withStyles } from '../../helpers/withStylesHelper';
const s = require('./emailToggleItem.scss');

interface EmailToggleItemProps {
  title: string;
  subtitle: string;
  active: boolean;
  onClick: (nextStatus: boolean) => void;
  isLoading: boolean;
  hasFailed: boolean;
}
const EmailToggleItem: React.FC<EmailToggleItemProps> = ({
  title,
  subtitle,
  active,
  onClick,
  isLoading,
  hasFailed,
}) => {
  return (
    <div className={s.toggleItemWrapper}>
      <div>
        <div className={s.toggleItemTitle}>{title}</div>
        <div className={s.toggleItemSubtitle}>{subtitle}</div>
      </div>
      <div>
        <button
          onClick={() => {
            onClick(true);
          }}
          className={classNames({
            [s.toggleButton]: true,
            [s.toggleActive]: active,
          })}
        >
          On
        </button>
        <button
          onClick={() => {
            onClick(false);
          }}
          className={classNames({
            [s.toggleButton]: true,
            [s.toggleInactive]: !active,
          })}
        >
          Off
        </button>
      </div>
    </div>
  );
};

export default withStyles<typeof EmailToggleItem>(s)(EmailToggleItem);
