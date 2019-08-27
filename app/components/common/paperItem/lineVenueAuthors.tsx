import * as React from 'react';
import LineVenue from './lineVenue';
import LineAuthors from './lineAuthors';
import Icon from '../../../icons';
import { Paper } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./lineVenueAuthors.scss');

export interface VenueAndAuthorsProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
}

const LineVenueAuthors: React.FC<VenueAndAuthorsProps> = props => {
  const { paper, pageType, actionArea } = props;
  const { authors } = paper;

  return (
    <div className={styles.publishInfoList}>
      <LineVenue paper={paper} pageType={pageType} actionArea={actionArea} />
      {authors && (
        <div className={styles.author}>
          <Icon className={styles.authorIcon} icon="AUTHOR" />
          <LineAuthors paper={paper} authors={authors} pageType={pageType} actionArea={actionArea} />
        </div>
      )}
    </div>
  );
};

export default withStyles<typeof LineVenueAuthors>(styles)(LineVenueAuthors);
