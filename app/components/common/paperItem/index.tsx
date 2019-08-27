import * as React from 'react';
import { CurrentUser } from '../../../model/currentUser';
import Abstract from './abstract';
import PaperActionButtons from './paperActionButtons';
import Title from './title';
import VenueAndAuthors from './venueAndAuthors';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
import SavedCollections from './savedCollections';
const styles = require('./paperItem.scss');

export interface PaperItemProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  hasCollection?: boolean;
  paperNote?: string;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  currentUser?: CurrentUser;
  omitAbstract?: boolean;
  omitButtons?: boolean;
  hasRemoveButton?: boolean;
  handleRemovePaper?: (paper: Paper) => void;
  isRepresentative?: boolean;
  handleToggleRepresentative?: (paper: Paper) => void;
  onRemovePaperCollection?: (paperId: number) => Promise<void>;
}

class BasePaperItem extends React.PureComponent<PaperItemProps> {
  public render() {
    const {
      paper,
      paperNote,
      wrapperClassName,
      currentUser,
      wrapperStyle,
      pageType,
      omitAbstract,
      omitButtons,
      hasRemoveButton,
      handleRemovePaper,
      isRepresentative,
      handleToggleRepresentative,
      actionArea,
      hasCollection,
      onRemovePaperCollection,
    } = this.props;
    const { authors, publishedDate, journal, conferenceInstance, relation } = paper;

    const abstract = !omitAbstract ? (
      <Abstract
        paperId={paper.id}
        pageType={pageType}
        actionArea={actionArea}
        abstract={paper.abstractHighlighted || paper.abstract}
      />
    ) : null;

    const buttons =
      !omitButtons && currentUser ? (
        <PaperActionButtons
          currentUser={currentUser}
          paper={paper}
          paperNote={paperNote}
          hasCollection={!!hasCollection}
          pageType={pageType}
          actionArea={actionArea}
          hasRemoveButton={hasRemoveButton}
          handleRemovePaper={handleRemovePaper}
          isRepresentative={isRepresentative}
          handleToggleRepresentative={handleToggleRepresentative}
          onRemovePaperCollection={onRemovePaperCollection}
        />
      ) : null;

    return (
      <div style={wrapperStyle} className={`${wrapperClassName ? wrapperClassName : styles.paperItemWrapper}`}>
        <div className={styles.contentSection}>
          {!!relation && relation.savedInCollections.length >= 1 ? (
            <SavedCollections collections={relation.savedInCollections} />
          ) : null}
          <Title paper={paper} pageType={pageType} actionArea={actionArea} />
          <VenueAndAuthors
            pageType={pageType}
            actionArea={actionArea}
            paper={paper}
            journal={journal}
            conferenceInstance={conferenceInstance}
            publishedDate={publishedDate}
            authors={authors}
          />
          {abstract}
          {buttons}
        </div>
      </div>
    );
  }
}

export default withStyles<typeof BasePaperItem>(styles)(BasePaperItem);
