import * as React from "react";
import * as autosize from "autosize";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./autoSizeTextarea.scss");

interface AutoSizeTextareaProps
  extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  wrapperStyle?: React.CSSProperties;
  textareaStyle?: React.CSSProperties;
  wrapperClassName?: string;
  textAreaClassName?: string;
}

@withStyles<typeof AutoSizeTextarea>(styles)
class AutoSizeTextarea extends React.PureComponent<AutoSizeTextareaProps, {}> {
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
    const { wrapperClassName, textAreaClassName, wrapperStyle, textareaStyle, ...textAreaProps } = this.props;

    return (
      <div className={wrapperClassName} style={wrapperStyle}>
        <textarea
          {...textAreaProps}
          style={textareaStyle}
          rows={textAreaProps.rows || 1}
          className={`form-control ${styles.textarea} ${textAreaClassName}`}
          ref={el => (this.textareaDom = el)}
        />
      </div>
    );
  }
}

export default AutoSizeTextarea;
