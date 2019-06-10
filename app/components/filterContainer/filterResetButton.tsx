import * as React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { FILTER_BOX_TYPE } from '../../constants/paperSearch';
import { withStyles } from '../../helpers/withStylesHelper';
import makeNewFilterLink from '../../helpers/makeNewFilterLink';
import PapersQueryFormatter from '../../helpers/searchQueryManager';
const styles = require('./filterResetButton.scss');

interface FilterResetButtonProps extends RouteComponentProps<any> {
  filterType?: FILTER_BOX_TYPE;
  currentSavedFilterSet?: string;
  btnStyle?: React.CSSProperties;
  text?: string | null;
}

function getFilterObject(props: FilterResetButtonProps) {
  const { filterType, currentSavedFilterSet } = props;

  if (!!currentSavedFilterSet && currentSavedFilterSet.length > 0) {
    return PapersQueryFormatter.objectifyPaperFilter(currentSavedFilterSet);
  }

  if (!!filterType) {
    const returnValue =
      filterType === 'PUBLISHED_YEAR' ? { yearFrom: undefined, yearTo: undefined } : { [filterType.toLowerCase()]: [] };

    return returnValue;
  } else {
    return {
      yearFrom: undefined,
      yearTo: undefined,
      fos: [],
      journal: [],
    };
  }
}

const FilterResetButton: React.FunctionComponent<FilterResetButtonProps> = props => {
  return (
    <Link
      to={makeNewFilterLink(getFilterObject(props), props.location)}
      onClick={e => {
        e.stopPropagation();
      }}
      className={styles.resetButtonWrapper}
      style={props.btnStyle}
    >
      {!!props.text ? props.text : 'Reset'}
    </Link>
  );
};

export default withRouter(withStyles<typeof FilterResetButton>(styles)(FilterResetButton));
