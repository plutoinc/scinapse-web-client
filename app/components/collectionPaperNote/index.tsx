import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { updatePaperNote } from '../../actions/collection';
import PaperNoteForm from '../paperShow/noteForm';
import { withStyles } from '../../helpers/withStylesHelper';
import NoteContent from './noteContent';
import ActionTicketManager from '../../helpers/actionTicketManager';
const styles = require('./collectionPaperNote.scss');

interface CollectionPaperNoteProps {
  dispatch: Dispatch<any>;
  paperId: string;
  collectionId: number;
  maxHeight: number;
  note?: string;
}

interface CollectionPaperNoteState {
  isLoading: boolean;
  isEdit: boolean;
}

@withStyles<typeof CollectionPaperNote>(styles)
class CollectionPaperNote extends React.PureComponent<CollectionPaperNoteProps, CollectionPaperNoteState> {
  public constructor(props: CollectionPaperNoteProps) {
    super(props);

    this.state = {
      isLoading: false,
      isEdit: false,
    };
  }

  public render() {
    const { note, maxHeight } = this.props;
    const { isEdit, isLoading } = this.state;

    if (!maxHeight) return null;

    if (!note || isEdit) {
      return (
        <div className={styles.memoForm}>
          <PaperNoteForm
            isEdit={isEdit}
            hideButton={true}
            omitCancel={!isEdit}
            initialValue={note}
            isLoading={isLoading}
            onSubmit={this.handleSubmitNote}
            onClickCancel={this.toggleNoteEditMode}
            textareaStyle={{
              border: 0,
              padding: 0,
              borderRadius: '8px',
              fontSize: '14px',
              width: '100%',
              height: '21px',
              maxHeight: '500px',
            }}
            textAreaClassName={styles.memoTextarea}
          />
        </div>
      );
    }

    if (note) {
      return (
        <NoteContent
          note={note}
          maxHeight={maxHeight}
          toggleNoteEditMode={this.toggleNoteEditMode}
          handleDeleteNote={this.handleDeleteNote}
        />
      );
    }

    return null;
  }

  private toggleNoteEditMode = () => {
    this.setState(prevState => ({ ...prevState, isEdit: !prevState.isEdit }));
  };

  private handleDeleteNote = () => {
    const { dispatch, paperId, collectionId } = this.props;

    if (confirm('Are you SURE to remove this memo?')) {
      dispatch(
        updatePaperNote({
          paperId,
          collectionId,
          note: null,
        })
      );
      ActionTicketManager.trackTicket({
        pageType: 'collectionShow',
        actionType: 'fire',
        actionArea: 'paperList',
        actionTag: 'removeNote',
        actionLabel: String(paperId),
      });
    }
  };

  private handleSubmitNote = async (note: string) => {
    const { dispatch, paperId, collectionId } = this.props;

    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      await dispatch(
        updatePaperNote({
          paperId,
          collectionId,
          note,
        })
      );
      ActionTicketManager.trackTicket({
        pageType: 'collectionShow',
        actionType: 'fire',
        actionArea: 'paperList',
        actionTag: 'addNote',
        actionLabel: String(paperId),
      });

      this.setState(prevState => ({ ...prevState, isLoading: false, isEdit: false }));
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };
}

export default connect()(CollectionPaperNote);
