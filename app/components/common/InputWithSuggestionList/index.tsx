import * as React from "react";
import { escapeRegExp } from "lodash";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import ScinapseCommonInput from "../scinapseInput";

const styles = require("./inputWithSuggestionList.scss");

interface InputWithSuggestionListProps {
  placeholder: string;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onSubmit: (query: string) => void;
  suggestionList: string[];
  defaultValue?: string;
  wrapperStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  listWrapperStyle?: React.CSSProperties;
  listItemStyle?: React.CSSProperties;
  autoFocus?: boolean;
  icon?: string;
}

interface InputWithSuggestionListState {
  focus: number;
  isLoading: boolean;
  inputValue: string;
  highlightValue: string;
}

@withStyles<typeof InputWithSuggestionList>(styles)
class InputWithSuggestionList extends React.PureComponent<InputWithSuggestionListProps, InputWithSuggestionListState> {
  public constructor(props: InputWithSuggestionListProps) {
    super(props);

    this.state = {
      focus: 0,
      isLoading: false,
      inputValue: props.defaultValue || "",
      highlightValue: "",
    };
  }

  public componentWillReceiveProps(nextProps: Readonly<InputWithSuggestionListProps>) {
    if (this.props.defaultValue !== nextProps.defaultValue) {
      this.setState(prevState => ({ ...prevState, inputValue: nextProps.defaultValue || "" }));
    }
  }

  public render() {
    const { icon, autoFocus, placeholder, inputStyle, wrapperStyle, listWrapperStyle } = this.props;
    const { inputValue } = this.state;

    return (
      <div className={styles.inputWithListWrapper}>
        <ScinapseCommonInput
          autoFocus={autoFocus}
          onChange={this.handleChangeInput}
          placeholder={placeholder}
          onKeydown={this.handleKeydown}
          onSubmit={() => {
            this.props.onSubmit(inputValue);
          }}
          value={inputValue}
          wrapperStyle={wrapperStyle}
          inputStyle={inputStyle}
          icon={icon}
        />
        <ul style={listWrapperStyle} className={styles.suggestionList}>
          {this.getHighlightedList()}
        </ul>
      </div>
    );
  }

  private getHighlightedList = () => {
    const { suggestionList, listItemStyle, onSubmit } = this.props;
    const { highlightValue, focus } = this.state;

    const words = highlightValue
      .split(" ")
      .map(word => {
        if (!!word && word.length > 0) {
          return escapeRegExp(word.trim());
        }
      })
      .join("|");

    const regex = new RegExp(`(${words})`, "i");

    return suggestionList.map((suggestion, index) => {
      const suggestionWords = suggestion.split(" ").map(word => word.trim());

      return (
        <li
          className={classNames({
            [styles.keywordCompletionItem]: focus !== index,
            [styles.highLightKeywordCompletionItem]: focus === index,
          })}
          onClick={() => {
            onSubmit(suggestion);
          }}
          style={listItemStyle}
          key={index}
          dangerouslySetInnerHTML={{
            __html: suggestionWords
              .map(word => word && word.replace(regex, matchWord => `<b>${matchWord}</b>`))
              .join(" "),
          }}
        />
      );
    });
  };

  private handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { suggestionList, onSubmit } = this.props;
    const { focus, inputValue } = this.state;

    switch (e.keyCode) {
      case 13: {
        onSubmit(inputValue);
        break;
      }

      case 9: // tab
      case 40: {
        // down
        e.preventDefault();
        const nextFocus = Math.min(focus + 1, suggestionList.length - 1);
        this.setState(prevState => ({ ...prevState, focus: nextFocus, inputValue: suggestionList[nextFocus] }));
        break;
      }

      case 38: {
        // up
        e.preventDefault();
        if (this.state.focus > 0) {
          this.setState(prevState => ({ ...prevState, focus: focus - 1, inputValue: suggestionList[focus - 1] }));
        }
        break;
      }
    }
  };

  private handleChangeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const value = e.currentTarget.value;

    this.setState(prevState => ({ ...prevState, inputValue: value, highlightValue: value, focus: 0 }));

    onChange(e);
  };
}

export default InputWithSuggestionList;
