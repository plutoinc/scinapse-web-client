import * as React from "react";
import * as autosize from "autosize";

interface IAutoSizeTextareaProps
  extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {}

class AutoSizeTextarea extends React.PureComponent<IAutoSizeTextareaProps, {}> {
  private textareaDom: HTMLTextAreaElement;
  public componentDidUpdate() {
    if (this.textareaDom && this.textareaDom.value.length === 0) {
      autosize.update(this.textareaDom);
    }
  }

  public componentDidMount() {
    if (this.textareaDom) {
      autosize(this.textareaDom);
    }
  }

  public render() {
    return (
      <textarea
        {...this.props}
        ref={el => {
          this.textareaDom = el;
        }}
      />
    );
  }
}

export default AutoSizeTextarea;
