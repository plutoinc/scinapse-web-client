import React from 'react';
import { useSelector } from 'react-redux';
import { Paper } from '../../../model/paper';
import CitationListLinkButton from './citationListLinkButton';
import SourceButton from './sourceButton';
import CiteButton from './citeButton';
import CollectionButton from './collectionButton';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperSource } from '../../../api/paper';
import MoreDropdownButton from './moreDropdownButton';
import { AppState } from '../../../reducers';
import { UserDevice } from '../../layouts/reducer';
import NoteButton from './noteButton';
import MobileNoteForm from './mobileNoteForm';
const s = require('./paperItemButtonGroup.scss');

interface PaperItemButtonGroupProps {
  paper: Paper;
  collectionId: number;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  paperSource?: PaperSource;
  dropdownContents?: React.ReactElement[];
  note?: string;
}

const PaperItemButtonGroup: React.FC<PaperItemButtonGroupProps> = ({
  paper,
  collectionId,
  pageType,
  actionArea,
  paperSource,
  dropdownContents,
  note,
}) => {
  const userDevice = useSelector<AppState, UserDevice>(state => state.layout.userDevice);
  if (userDevice === UserDevice.MOBILE) {
    return (
      <>
        <div className={s.mobileWrapper}>
          <div className={s.buttonWrapper}>
            <CitationListLinkButton paper={paper} pageType={pageType} actionArea={actionArea} />
          </div>
          <div className={s.buttonWrapper}>
            <SourceButton paper={paper} pageType={pageType} actionArea={actionArea} paperSource={paperSource} />
          </div>
          <div className={s.buttonWrapper}>
            <CollectionButton paper={paper} pageType={pageType} actionArea={actionArea} saved />
          </div>
        </div>
        <MobileNoteForm note={note} paperId={paper.id} collectionId={collectionId} />
      </>
    );
  }

  return (
    <div className={s.groupWrapper}>
      <div className={s.buttonListBox}>
        <CitationListLinkButton paper={paper} pageType={pageType} actionArea={actionArea} />
        <SourceButton paper={paper} pageType={pageType} actionArea={actionArea} paperSource={paperSource} />
        <MoreDropdownButton dropdownContents={dropdownContents} paper={paper} />
      </div>
      <div className={s.buttonListBox}>
        <div className={s.buttonWrapper}>
          <CiteButton paper={paper} pageType={pageType} actionArea={actionArea} className={s.citeButton} />
        </div>
        <div className={s.buttonWrapper}>
          <NoteButton
            note={note}
            paperId={paper.id}
            collectionId={collectionId}
            pageType={pageType}
            actionArea={actionArea}
          />
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof PaperItemButtonGroup>(s)(PaperItemButtonGroup);
