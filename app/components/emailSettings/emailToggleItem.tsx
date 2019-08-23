import React from 'react';
import classNames from 'classnames';
import { withStyles } from '../../helpers/withStylesHelper';
const s = require('./emailToggleItem.scss');

const EmailToggleItem: React.FC<{ title: string; subtitle: string; active: boolean }> = ({
  title,
  subtitle,
  active,
}) => {
  return (
    <div className={s.toggleItemWrapper}>
      <div>
        <div className={s.toggleItemTitle}>{title}</div>
        <div className={s.toggleItemSubtitle}>{subtitle}</div>
      </div>
      <div>
        <button
          className={classNames({
            [s.toggleButton]: true,
            [s.toggleActive]: active,
          })}
        >
          On
        </button>
        <button
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
