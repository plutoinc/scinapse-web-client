import * as React from "react";
import * as classNames from "classnames";
import { Prompt } from "react-router-dom";
import AutoSizeTextarea from "../../common/autoSizeTextarea";
import { withStyles } from "../../../helpers/withStylesHelper";
import ArticleSpinner from "../../common/spinner/articleSpinner";
const styles = require("./noteForm.scss");

export interface PaperNoteFormProps {
  isLoading: boolean;
  onSubmit: (note: string) => void;
  isEdit: boolean;
  textareaStyle?: React.CSSProperties;
  textAreaClassName?: string;
  omitCancel?: boolean;
  hideButton?: boolean;
  autoFocus?: boolean;
  row?: number;
  onClickCancel?: () => void;
  initialValue?: string | null;
}

interface PaperNoteFormState {
  note: string;
  isBlocking: boolean;
  isFocus: boolean;
}

interface ButtonsProps {
  isLoading: boolean;
  isEdit: boolean;
  handleClickCancel: () => void;
  disabled: boolean;
  hideButton?: boolean;
  omitCancel?: boolean;
}

interface NoteEditButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
}

const Buttons: React.SFC<ButtonsProps> = ({
  isLoading,
  handleClickCancel,
  hideButton,
  omitCancel,
  isEdit,
  disabled,
}) => {
  return (
    <div
      className={classNames({
        [styles.editButtonWrapper]: true,
        [styles.hideEditButtonWrapper]: hideButton,
      })}
    >
      <NoteEditButton disabled={disabled} isLoading={isLoading} type="submit">
        {isLoading ? (
          <span>
            <ArticleSpinner className={styles.loadingButton} />
          </span>
        ) : (
          <span className={styles.doneButton}>{isEdit ? "Done" : "Add"}</span>
        )}
      </NoteEditButton>

      {!omitCancel && (
        <NoteEditButton isLoading={isLoading} type="button" onClick={handleClickCancel}>
          <span className={styles.cancelButton}>Cancel</span>
        </NoteEditButton>
      )}
    </div>
  );
};

const NoteEditButton: React.SFC<NoteEditButtonProps> = props => {
  return (
    <button
      className={styles.noteEditButton}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled || props.isLoading}
    >
      {props.children}
    </button>
  );
};

@withStyles<typeof PaperNoteForm>(styles)
class PaperNoteForm extends React.PureComponent<PaperNoteFormProps, PaperNoteFormState> {
  public constructor(props: PaperNoteFormProps) {
    super(props);

    this.state = {
      note: props.initialValue || "",
      isBlocking: false,
      isFocus: false,
    };
  }

  public render() {
    const { isLoading, autoFocus, hideButton, omitCancel, textareaStyle, textAreaClassName, row, isEdit } = this.props;
    const { note, isBlocking, isFocus } = this.state;

    return (
      <form
        style={{
          border: isFocus ? "solid 3px #e7eaef" : "solid 1px #e7eaef",
        }}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={styles.form}
        onSubmit={this.handleSubmit}
      >
        <AutoSizeTextarea
          wrapperStyle={{
            borderRadius: "8px",
            margin: isFocus ? "10px 10px 22px 10px" : "12px 12px 24px 12px",
          }}
          tabIndex={0}
          textareaStyle={textareaStyle}
          textAreaClassName={textAreaClassName || styles.noteTextArea}
          value={note}
          disabled={isLoading}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDownNoteTextarea}
          autoFocus={autoFocus}
          placeholder="Write a memo..."
          rows={row}
        />
        <Buttons
          isEdit={isEdit}
          omitCancel={omitCancel}
          hideButton={hideButton}
          isLoading={isLoading}
          handleClickCancel={this.handleClickCancel}
          disabled={!note && !isEdit}
        />
        <Prompt when={isBlocking} message={`Are you sure to leave?\nEditing content would not be saved.`} />
      </form>
    );
  }

  private handleFocus = () => {
    this.setState(prevState => ({ ...prevState, isFocus: true }));
  };

  private handleBlur = () => {
    this.setState(prevState => ({ ...prevState, isFocus: false }));
  };

  private handleClickCancel = () => {
    const { onClickCancel } = this.props;

    if (onClickCancel) {
      onClickCancel();
      this.setState({
        isBlocking: false,
        isFocus: false,
      });
    } else {
      this.setState(prevState => ({ ...prevState, note: "", isBlocking: false, isFocus: false }));
    }
  };

  private handleKeyDownNoteTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.keyCode === 13 && e.ctrlKey) || (e.keyCode === 13 && e.metaKey)) {
      this.handleSubmit();
    }
  };

  private handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      note: e.currentTarget.value,
      isBlocking: true,
    });
  };

  private handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    const { onSubmit } = this.props;
    const { note } = this.state;

    e && e.preventDefault();

    // validate form
    if (!note && !confirm("Do you want to discard this memo?")) {
      return;
    }
    if (note && note.length > 500) {
      return alert("The maximum length of memo is 500 characters.");
    }

    onSubmit(note);
    this.setState({
      isBlocking: false,
      isFocus: false,
    });
  };
}

export default PaperNoteForm;
