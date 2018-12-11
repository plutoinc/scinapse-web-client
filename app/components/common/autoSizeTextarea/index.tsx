import * as React from "react";
import * as autosize from "autosize";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./autoSizeTextarea.scss");

interface AutoSizeTextareaProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  wrapperStyle?: React.CSSProperties;
  textareaStyle?: React.CSSProperties;
  wrapperClassName?: string;
  textAreaClassName?: string;
  onFocusFunc?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDownFunc?: ((e: React.KeyboardEvent<HTMLTextAreaElement>) => void);
  defaultValue?: string;
  placeHolder?: string;
  rows?: number;
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
    const {
      onChange,
      onFocusFunc,
      onKeyDownFunc,
      defaultValue,
      placeHolder,
      disabled,
      wrapperClassName,
      textAreaClassName,
      rows,
      wrapperStyle,
      textareaStyle,
    } = this.props;

    return (
      <div className={wrapperClassName} style={wrapperStyle}>
        <textarea
          style={textareaStyle}
          rows={rows || 1}
          onFocus={onFocusFunc}
          onChange={onChange}
          onKeyDown={onKeyDownFunc}
          disabled={disabled}
          value={defaultValue}
          placeholder={placeHolder}
          className={`form-control ${styles.textarea} ${textAreaClassName}`}
          ref={el => (this.textareaDom = el)}
        />
      </div>
    );
  }
}

export default AutoSizeTextarea;
