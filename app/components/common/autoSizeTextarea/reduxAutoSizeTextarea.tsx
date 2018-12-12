import * as React from "react";
import * as autosize from "autosize";
import { withStyles } from "../../../helpers/withStylesHelper";
import { WrappedFieldProps } from "redux-form";
const styles = require("./autoSizeTextarea.scss");

interface ReduxAutoSizeTextareaProps extends WrappedFieldProps {
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  textareaStyle?: React.CSSProperties;
  textareaClassName?: string;
  placeholder?: string;
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
    const {
      input,
      textareaClassName,
      placeholder,
      disabled,
      wrapperStyle,
      wrapperClassName,
      textareaStyle,
      rows,
    } = this.props;
    const { onChange, value } = input;

    return (
      <div className={wrapperClassName} style={wrapperStyle}>
        <textarea
          rows={rows || 1}
          onChange={onChange}
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          style={textareaStyle}
          className={`form-control ${styles.textArea} ${textareaClassName}`}
          ref={el => (this.textareaDom = el)}
        />
      </div>
    );
  }
}

export default ReduxAutoSizeTextarea;
