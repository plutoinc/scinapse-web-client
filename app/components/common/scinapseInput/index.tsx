import * as React from "react";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./scinapseInput.scss");

interface InputBoxProps {
  placeholder: string;
  autoFocus?: boolean;
  icon?: string;
  inputStyle?: React.CSSProperties;
  onSubmit?: (inputValue: string) => void;
}

interface InputBoxStates {
  inputValue: string;
}

class ScinapseCommonInput extends React.PureComponent<InputBoxProps, InputBoxStates> {
  constructor(props: InputBoxProps) {
    super(props);

    this.state = {
      inputValue: "",
    };
  }

  public render() {
    const { placeholder, autoFocus = false } = this.props;

    return (
      <div className={styles.inputBox}>
        <input
          onKeyDown={this.handleKeyDown}
          placeholder={placeholder}
          onChange={this.handleChange}
          autoFocus={autoFocus}
        />
        {this.getIcon()}
      </div>
    );
  }

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && this.props.onSubmit) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  private handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      inputValue: e.currentTarget.value,
    });
  };

  private handleSubmit = () => {
    const { onSubmit } = this.props;
    const { inputValue } = this.state;

    console.log("FIRED");

    if (onSubmit) {
      onSubmit(inputValue);
    }
  };

  private getIcon() {
    const { icon } = this.props;

    if (icon) {
      return (
        <div onClick={this.handleSubmit} className={styles.icon}>
          <Icon icon={icon} />
        </div>
      );
    }
    return null;
  }
}

export default withStyles<typeof ScinapseCommonInput>(styles)(ScinapseCommonInput);
