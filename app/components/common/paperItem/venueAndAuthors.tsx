import * as React from 'react';
import Authors, { AuthorsProps } from './authors';
import PaperItemVenue from './venue';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import { Journal } from '../../../model/journal';
import { ConferenceInstance } from '../../../model/conferenceInstance';
const styles = require('./venueAndAuthors.scss');

export interface VenueAndAuthorsProps extends Readonly<AuthorsProps> {
  journal: Journal | null;
  conferenceInstance: ConferenceInstance | null;
  publishedDate: string | null;
}

class VenueAndAuthors extends React.PureComponent<VenueAndAuthorsProps, {}> {
  public render() {
    const { authors, journal, conferenceInstance, publishedDate, paper, pageType, actionArea } = this.props;

    return (
      <div className={styles.publishInfoList}>
        <PaperItemVenue
          journal={journal}
          paperId={paper.id}
          doi={paper.doi}
          conferenceInstance={conferenceInstance}
          publishedDate={publishedDate}
          pageType={pageType}
          actionArea={actionArea}
        />
        {authors ? (
          <div className={styles.author}>
            <Icon className={styles.authorIcon} icon="AUTHOR" />
            <Authors paper={paper} authors={authors} pageType={pageType} actionArea={actionArea} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles<typeof VenueAndAuthors>(styles)(VenueAndAuthors);
