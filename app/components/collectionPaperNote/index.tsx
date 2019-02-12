import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { updatePaperNote } from "../../actions/collection";
import PaperNoteForm from "../paperShow/noteForm";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";

const styles = require("./collectionPaperNote.scss");

interface CollectionPaperNoteProps {
  paperId: number;
  collectionId: number;
  note?: string;
  dispatch: Dispatch<any>;
}

interface CollectionPaperNoteState {
  isLoading: boolean;
  isEdit: boolean;
}

@withStyles<typeof CollectionPaperNote>(styles)
class CollectionPaperNote extends React.PureComponent<CollectionPaperNoteProps, CollectionPaperNoteState> {
  constructor(props: CollectionPaperNoteProps) {
    super(props);

    this.state = {
      isLoading: false,
      isEdit: false,
    };
  }

  public render() {
    const { note } = this.props;
    const { isEdit, isLoading } = this.state;

    if (note && !isEdit) {
      return (
        <div className={styles.memo}>
          <div className={styles.memoItem}>{note}</div>
          <div className={styles.noteButtonWrapper}>
            <span className={styles.noteControlIconWrapper} onClick={this.toggleNoteEditMode}>
              <Icon icon="PEN" className={`${styles.noteControlIcon} ${styles.penIcon}`} />
            </span>
            <span className={styles.noteControlIconWrapper} onClick={this.handleDeleteNote}>
              <Icon icon="TRASH_CAN" className={`${styles.noteControlIcon} ${styles.trashIcon}`} />
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.memoForm}>
        <PaperNoteForm
          hideButton={true}
          omitCancel={true}
          initialValue={note}
          isLoading={isLoading}
          onSubmit={this.handleSubmitNote}
        />
      </div>
    );
  }

  private toggleNoteEditMode = () => {
    this.setState(prevState => ({ ...prevState, isEdit: !prevState.isEdit }));
  };

  private handleDeleteNote = () => {
    const { dispatch, paperId, collectionId } = this.props;

    if (confirm("Are you SURE to remove this memo?")) {
      dispatch(
        updatePaperNote({
          paperId: paperId,
          collectionId: collectionId,
          note: null,
        })
      );
    }
  };

  private handleSubmitNote = async (note: string) => {
    const { dispatch, paperId, collectionId } = this.props;

    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      await dispatch(
        updatePaperNote({
          paperId: paperId,
          collectionId,
          note,
        })
      );
      this.setState(prevState => ({ ...prevState, isLoading: false, isEdit: false }));
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };
}

export default connect()(CollectionPaperNote);
