import * as React from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import Icon from '../../icons';
const styles = require('./collectionPaperNote.scss');

interface NoteContentProps {
  note: string;
  toggleNoteEditMode: () => void;
  handleDeleteNote: () => void;
  maxHeight?: number;
}

const NoteContent: React.SFC<NoteContentProps> = props => {
  return (
    <div className={styles.note}>
      <div style={{ maxHeight: props.maxHeight }} className={styles.memoItem}>
        {props.note}
      </div>
      <div className={styles.noteButtonWrapper}>
        <span className={styles.noteControlIconWrapper} onClick={props.toggleNoteEditMode}>
          <Icon icon="PEN" className={`${styles.noteControlIcon} ${styles.penIcon}`} />
        </span>
        <span className={styles.noteControlIconWrapper} onClick={props.handleDeleteNote}>
          <Icon icon="TRASH_CAN" className={`${styles.noteControlIcon} ${styles.trashIcon}`} />
        </span>
      </div>
    </div>
  );
};

export default withStyles<typeof NoteContent>(styles)(NoteContent);
