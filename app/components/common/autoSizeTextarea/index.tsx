import * as React from "react";
import * as autosize from "autosize";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./autoSizeTextarea.scss");

interface AutoSizeTextareaProps {
  onChangeFunc: (value: string) => void;
  wrapperClassName?: string;
  textAreaClassName?: string;
  onFocusFunc?: () => void;
  onKeyDownFunc?: ((e: React.KeyboardEvent<HTMLTextAreaElement>) => void);
  defaultValue?: string;
  placeHolder?: string;
  disabled: boolean;
}

@withStyles<typeof AutoSizeTextarea>(styles)
class AutoSizeTextarea extends React.PureComponent<AutoSizeTextareaProps, {}> {
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
    const {
      onChangeFunc,
      onFocusFunc,
      onKeyDownFunc,
      defaultValue,
      placeHolder,
      disabled,
      wrapperClassName,
      textAreaClassName,
    } = this.props;

    return (
      <div className={wrapperClassName}>
        <textarea
          rows={1}
          onFocus={onFocusFunc}
          onChange={e => {
            onChangeFunc(e.currentTarget.value);
          }}
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
