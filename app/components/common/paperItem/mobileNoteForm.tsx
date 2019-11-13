import React from 'react';
import { useDispatch } from 'react-redux';
import Icon from '../../../icons';
import { updatePaperNote } from '../../../actions/collection';
import ActionTicketManager from '../../../helpers/actionTicketManager';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./mobileNoteForm.scss');

interface MobileNoteFormProps {
  paperId: string;
  collectionId: string;
  note?: string;
}

const MobileNoteForm: React.FC<MobileNoteFormProps> = ({ note, paperId, collectionId }) => {
  useStyles(s);
  const dispatch = useDispatch();
  const [newNote, setNewNote] = React.useState(note || '');
  const [isEditMode, setIsEditMode] = React.useState(false);

  const handleSubmitNote = async () => {
    if (!newNote) return;

    setIsEditMode(false);

    await dispatch(
      updatePaperNote({
        paperId,
        collectionId,
        note: newNote,
      })
    );
    ActionTicketManager.trackTicket({
      pageType: 'collectionShow',
      actionType: 'fire',
      actionArea: 'paperList',
      actionTag: 'addNote',
      actionLabel: String(paperId),
    });
  };

  if (!note || isEditMode) {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmitNote();
        }}
        className={s.writeWrapper}
      >
        <input
          value={newNote}
          onChange={e => setNewNote(e.currentTarget.value)}
          className={s.input}
          placeholder="Write a note..."
        />
        <Icon onClick={handleSubmitNote} className={s.addNoteIcon} icon="ADD_NOTE" />
      </form>
    );
  }

  return (
    <div className={s.readWrapper} onClick={() => setIsEditMode(true)}>
      <Icon className={s.viewNoteIcon} icon="NOTED" />
      <div className={s.noteContent}>{note}</div>
    </div>
  );
};

export default MobileNoteForm;
