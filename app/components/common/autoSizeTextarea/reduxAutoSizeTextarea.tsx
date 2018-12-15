import * as React from "react";
import * as autosize from "autosize";
import { FieldProps } from "formik";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./autoSizeTextarea.scss");

interface ReduxAutoSizeTextareaProps extends React.HTMLProps<HTMLTextAreaElement> {
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  textareaStyle?: React.CSSProperties;
  textareaClassName?: string;
}

@withStyles<typeof ReduxAutoSizeTextarea>(styles)
class ReduxAutoSizeTextarea extends React.PureComponent<ReduxAutoSizeTextareaProps & FieldProps> {
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
      field,
      form,
      textareaClassName,
      wrapperStyle,
      wrapperClassName,
      textareaStyle,
      rows,
      ...textAreaProps
    } = this.props;
    const { value, name } = field;

    return (
      <div className={wrapperClassName} style={wrapperStyle}>
        <textarea
          rows={rows || 1}
          onChange={() => {
            form.setFieldValue(name, value);
          }}
          style={textareaStyle}
          className={`form-control ${styles.textarea} ${textareaClassName}`}
          ref={el => (this.textareaDom = el)}
          {...textAreaProps}
        />
      </div>
    );
  }
}

export default ReduxAutoSizeTextarea;
