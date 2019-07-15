import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import classNames from 'classnames';
import Icon from '../../icons';
import { withStyles } from '../../helpers/withStylesHelper';
import formatNumber from '../../helpers/formatNumber';

const s = require('./journalFilterItem.scss');

interface JournalItemProps {
  title: string;
  checked: boolean;
  isHighlight: boolean;
  onClick: () => void;
  omitDocCount?: boolean;
  docCount?: number;
  IF?: number;
}

const JournalItem: React.FC<JournalItemProps> = props => {
  let ImpactFactor = null;
  if (props.IF) {
    ImpactFactor = (
      <span
        className={classNames({
          [s.ifLabel]: true,
          [s.noDocCount]: props.omitDocCount,
        })}
      >
        <Tooltip
          disableFocusListener={true}
          disableTouchListener={true}
          title="Impact Factor"
          placement="top"
          classes={{ tooltip: s.arrowBottomTooltip }}
        >
          <span>
            <Icon className={s.ifIconWrapper} icon="IMPACT_FACTOR" />
            {props.IF.toFixed(2)}
          </span>
        </Tooltip>
      </span>
    );
  }

  let docCount = null;
  if (props.docCount) {
    docCount = <span className={s.countBox}>{`(${formatNumber(props.docCount)})`}</span>;
  }

  return (
    <button
      onClick={props.onClick}
      className={classNames({
        [s.journalItem]: true,
        [s.isSelected]: props.checked,
        [s.highlighted]: props.isHighlight,
      })}
    >
      <span className={s.title}>{props.title}</span>
      {ImpactFactor}
      <span className={s.countBox}>{docCount}</span>
    </button>
  );
};

export default withStyles<typeof JournalItem>(s)(JournalItem);
