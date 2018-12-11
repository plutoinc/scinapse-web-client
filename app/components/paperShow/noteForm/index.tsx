import * as React from "react";
import AutoSizeTextarea from "../../common/autoSizeTextarea";

interface PaperNoteFormProps {
  isLoading: boolean;
  handleSubmit: (note: string) => void;
}

interface PaperNoteFormState {
  note: string;
}

class PaperNoteForm extends React.PureComponent<PaperNoteFormProps, PaperNoteFormState> {
  constructor(props: PaperNoteFormProps) {
    super(props);

    this.state = {
      note: "",
    };
  }

  public render() {
    const { isLoading } = this.props;

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
          }}
          onChange={this.handleChange}
          disabled={isLoading}
        />
      </form>
    );
  }

  private handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      note: e.currentTarget.value,
    });
  };

  private handleSubmit = () => {
    const { note } = this.state;

    // validate form
    if (!note) {
      return alert("You should enter memo!");
    }
    if (note && note.length > 500) {
      return alert("The maximum length of memo is 500 characters.");
    }

    console.log(note);
  };
}

export default PaperNoteForm;
