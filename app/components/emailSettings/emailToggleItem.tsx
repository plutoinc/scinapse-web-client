import React, { useEffect } from 'react';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../helpers/withStylesHelper';
import alertToast from '../../helpers/makePlutoToastAction';
const s = require('./emailToggleItem.scss');

interface EmailToggleItemProps {
  title: string;
  subtitle: string;
  active: boolean;
  onClick: (nextStatus: boolean) => void;
  isLoading: boolean;
  hasFailed: boolean;
  globalInActive?: boolean;
}

const EmailToggleItem: React.FC<EmailToggleItemProps> = ({
  title,
  subtitle,
  active,
  onClick,
  hasFailed,
  isLoading,
  globalInActive,
}) => {
  useEffect(
    () => {
      if (hasFailed) {
        alertToast({
          type: 'error',
          message: 'Failed to update email setting!',
        });
      }
    },
    [hasFailed]
  );

  const disabledButton = globalInActive || isLoading;

  return (
    <div className={s.toggleItemWrapper}>
      <div className={s.toggleItemContext}>
        <div className={s.toggleItemTitle}>{title}</div>
        <div className={s.toggleItemSubtitle}>{subtitle}</div>
      </div>
      <div
        className={classNames({
          [s.toggleButtonWrapper]: true,
          [s.blockedToggleButtonWrapper]: disabledButton,
        })}
      >
        {isLoading && <CircularProgress className={s.loadingSpinner} disableShrink={true} size={20} thickness={8} />}
        <button
          disabled={globalInActive}
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
          disabled={globalInActive}
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
