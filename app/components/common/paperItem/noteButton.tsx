import React from 'react';
import Popover from '@material-ui/core/Popover';
import CollectionPaperNote from '../../collectionPaperNote';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./noteButton.scss');

interface NoteButtonProps {
  paperId: number;
  collectionId: number;
  note?: string;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
}

const NoteButton: React.FC<NoteButtonProps> = ({ note, pageType, actionArea, paperId, collectionId }) => {
  useStyles(s);
  const noteRef = React.useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const hasNote = !!note;

  return (
    <div ref={noteRef}>
      <button
        className={s.addNoteButton}
        onClick={() => {
          setIsOpen(!isOpen);
          if (hasNote) {
            ActionTicketManager.trackTicket({
              pageType,
              actionType: 'fire',
              actionArea: actionArea || pageType,
              actionTag: 'viewNote',
              actionLabel: String(paperId),
            });
          }
        }}
      >
        {hasNote ? (
          <>
            <Icon className={s.addNoteIcon} icon="NOTED" />View Note
          </>
        ) : (
          <>
            <Icon className={s.addNoteIcon} icon="ADD_NOTE" /> Add Note
          </>
        )}
      </button>
      <Popover
        open={isOpen}
        classes={{ paper: s.collectionNoteForm }}
        anchorEl={noteRef.current}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <CollectionPaperNote maxHeight={120} note={note} collectionId={collectionId} paperId={paperId} />
      </Popover>
    </div>
  );
};

export default NoteButton;
