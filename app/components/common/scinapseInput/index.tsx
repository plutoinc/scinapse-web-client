import * as React from 'react';
import Icon from '../../../icons';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./scinapseInput.scss');

interface InputBoxProps extends React.HTMLProps<HTMLInputElement> {
  placeholder: string;
  autoFocus?: boolean;
  icon?: string;
  wrapperStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  value?: string;
  handleInputSubmit?: (inputValue: string) => void;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  onKeydown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface InputBoxStates {
  inputValue: string;
}

class ScinapseCommonInput extends React.PureComponent<InputBoxProps, InputBoxStates> {
  public constructor(props: InputBoxProps) {
    super(props);

    this.state = {
      inputValue: props.value || '',
    };
  }

  public render() {
    const {
      wrapperStyle,
      inputStyle,
      placeholder,
      onChange,
      onKeydown,
      value,
      autoFocus = false,
      ...inputProps
    } = this.props;
    const { inputValue } = this.state;

    return (
      <div style={wrapperStyle} className={styles.inputBox}>
        <input
          style={inputStyle}
          onKeyDown={onKeydown || this.handleKeyDown}
          onChange={onChange || this.handleChange}
          autoFocus={autoFocus}
          defaultValue={value === undefined ? inputValue : value}
          placeholder={placeholder}
          {...inputProps}
        />
        {this.getIcon()}
      </div>
    );
  }

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && this.props.handleInputSubmit) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  private handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { onChange } = this.props;

    const newStringValue = e.currentTarget.value;
    this.setState({
      inputValue: newStringValue,
    });

    onChange && onChange(e);
  };

  private handleSubmit = () => {
    const { handleInputSubmit } = this.props;
    const { inputValue } = this.state;

    if (handleInputSubmit) {
      handleInputSubmit(inputValue);
    }
  };

  private getIcon() {
    const { icon, iconStyle } = this.props;

    if (icon) {
      return (
        <div onClick={this.handleSubmit} className={styles.icon} style={iconStyle}>
          <Icon icon={icon} />
        </div>
      );
    }
    return null;
  }
}

export default withStyles<typeof ScinapseCommonInput>(styles)(ScinapseCommonInput);
