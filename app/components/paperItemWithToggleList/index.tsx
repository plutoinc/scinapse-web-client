import * as React from 'react';
import BasePaperItem from './components/basePaperItem';
import { withStyles } from '../../helpers/withStylesHelper';
import RefCitedList from './components/refCitedList';
import { PaperItemWithToggleListProps, TrackingProps } from './types';
const s = require('./paperItemWithToggleList.scss');

const PaperItemWithToggleList: React.FC<PaperItemWithToggleListProps & TrackingProps> = React.memo(props => {
  const { paper } = props;

  return (
    <div className={s.wrapper}>
      <BasePaperItem {...props} />
      <div className={s.listWrapper}>
        <RefCitedList
          pageType={props.pageType}
          actionArea={props.actionArea}
          type="ref"
          paperId={paper.id}
          paperCount={paper.referenceCount}
        />
        <RefCitedList
          pageType={props.pageType}
          actionArea={props.actionArea}
          type="cited"
          paperId={paper.id}
          paperCount={paper.citedCount}
        />
      </div>
    </div>
  );
});

export default withStyles<typeof PaperItemWithToggleList>(s)(PaperItemWithToggleList);
