import * as React from "react";
import * as autosize from "autosize";
import { withStyles } from "../../../helpers/withStylesHelper";
import { WrappedFieldProps } from "redux-form";
const styles = require("./autoSizeTextarea.scss");

interface ReduxAutoSizeTextareaProps extends WrappedFieldProps {
  wrapperStyle?: React.CSSProperties;
  textareaStyle?: React.CSSProperties;
  placeHolder?: string;
  rows?: number;
  disabled: boolean;
}

@withStyles<typeof ReduxAutoSizeTextarea>(styles)
class ReduxAutoSizeTextarea extends React.PureComponent<ReduxAutoSizeTextareaProps> {
  private textareaDom: HTMLTextAreaElement | null;
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
    const { input, placeHolder, disabled, wrapperStyle, textareaStyle, rows } = this.props;
    const { onChange, value } = input;

    return (
      <div style={wrapperStyle}>
        <textarea
          rows={rows || 1}
          onChange={onChange}
          disabled={disabled}
          value={value}
          placeholder={placeHolder}
          style={textareaStyle}
          className={`form-control ${styles.textArea}`}
          ref={el => (this.textareaDom = el)}
        />
      </div>
    );
  }
}

export default ReduxAutoSizeTextarea;
