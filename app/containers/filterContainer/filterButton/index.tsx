import * as React from 'react';
import * as classNames from 'classnames';
import { RouteComponentProps, withRouter } from 'react-router';
import { withStyles } from '../../../helpers/withStylesHelper';
import { goToYearFilteredSearchResultPage } from '../yearRangeSlider/helper';
import { MIN_YEAR } from '../yearRangeSlider/constants';

const styles = require('./filterButton.scss');

interface FilterButtonProps extends RouteComponentProps<null> {
  text: string;
  isActive: boolean;
  queryParamsStr: string;
  currentYear: number;
  onClick: () => void;
}

const FilterButton: React.FunctionComponent<FilterButtonProps> = props => {
  return (
    <button
      className={classNames({
        [styles.button]: true,
        [styles.isActive]: props.isActive,
      })}
      onClick={() => {
        if (props.isActive) {
          goToYearFilteredSearchResultPage({
            qs: props.queryParamsStr,
            history: props.history,
            max: props.currentYear,
            min: MIN_YEAR,
            fromBtn: true,
          });
        } else {
          props.onClick();
        }
      }}
    >
      {props.text}
    </button>
  );
};

export default withRouter(withStyles<typeof FilterButton>(styles)(FilterButton));
