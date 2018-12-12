import * as React from "react";
import AutoSizeTextarea from "../../common/autoSizeTextarea";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./noteForm.scss");

interface PaperNoteFormProps {
  isLoading: boolean;
  handleSubmit: (note: string) => void;
  handleCloseDropdown: () => void;
  initialValue?: string | null;
}

interface PaperNoteFormState {
  note: string;
}
const NoteEditButton: React.SFC<{ type: "button" | "submit"; onClick?: () => void; isLoading: boolean }> = props => {
  return (
    <button className={styles.noteEditButton} type={props.type} onClick={props.onClick} disabled={props.isLoading}>
      {props.children}
    </button>
  );
};

@withStyles<typeof PaperNoteForm>(styles)
class PaperNoteForm extends React.PureComponent<PaperNoteFormProps, PaperNoteFormState> {
  constructor(props: PaperNoteFormProps) {
    super(props);

    this.state = {
      note: props.initialValue || "",
    };
  }

  public render() {
    const { isLoading, handleCloseDropdown } = this.props;
    const { note } = this.state;

    return (
      <form style={{ borderRadius: "8px" }} onSubmit={this.handleSubmit}>
        <AutoSizeTextarea
          wrapperStyle={{
            borderRadius: "8px",
            margin: "12px",
          }}
          textareaStyle={{
            border: 0,
            padding: 0,
            borderRadius: "8px",
            fontSize: "14px",
            width: "100%",
            maxHeight: "105px",
          }}
          value={note}
          onChange={this.handleChange}
          disabled={isLoading}
        />
        <div className={styles.editButtonWrapper}>
          <NoteEditButton isLoading={isLoading} type="submit">
            <span className={styles.doneButton}>Done</span>
          </NoteEditButton>
          <NoteEditButton isLoading={isLoading} type="button" onClick={handleCloseDropdown}>
            <span className={styles.cancelButton}>Cancel</span>
          </NoteEditButton>
        </div>
      </form>
    );
  }

  private handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      note: e.currentTarget.value,
    });
  };

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const { handleSubmit } = this.props;
    const { note } = this.state;

    e.preventDefault();
    // validate form
    if (!note) {
      return alert("You should enter memo!");
    }
    if (note && note.length > 500) {
      return alert("The maximum length of memo is 500 characters.");
    }

    handleSubmit(note);
  };
}

export default PaperNoteForm;
