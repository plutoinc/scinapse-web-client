import * as React from 'react';
import Authors from './authors';
import PaperItemVenue from './venue';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import { Paper } from '../../../model/paper';
const styles = require('./venueAndAuthors.scss');

export interface VenueAndAuthorsProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
}

const VenueAndAuthors: React.FC<VenueAndAuthorsProps> = props => {
  const { paper, pageType, actionArea } = props;
  const { authors } = paper;

  return (
    <div className={styles.publishInfoList}>
      <PaperItemVenue paper={paper} pageType={pageType} actionArea={actionArea} />
      {authors && (
        <div className={styles.author}>
          <Icon className={styles.authorIcon} icon="AUTHOR" />
          <Authors paper={paper} authors={authors} pageType={pageType} actionArea={actionArea} />
        </div>
      )}
    </div>
  );
};

export default withStyles<typeof VenueAndAuthors>(styles)(VenueAndAuthors);
