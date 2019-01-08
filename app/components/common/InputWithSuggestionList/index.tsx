import * as React from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import { getHighlightedContent } from "../highLightedContent";
const styles = require("./inputWithSuggestionList.scss");

export interface DefaultItemComponentProps {
  userInput: string;
  onClick: () => void;
}

interface InputWithSuggestionListProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestionList: string[];
  handleSubmit: (inputValue: string) => void;
  wrapperClassName?: string;
  iconNode?: React.ReactNode;
  deleteIconNode?: React.ReactNode;
  defaultValue?: string;
  wrapperStyle?: React.CSSProperties;
  listWrapperStyle?: React.CSSProperties;
  listItemStyle?: React.CSSProperties;
  DefaultItemComponent?: React.SFC<DefaultItemComponentProps>;
}

interface InputWithSuggestionListState {
  focus: number;
  isOpen: boolean;
  isLoading: boolean;
  inputValue: string;
  highlightValue: string;
}

@withStyles<typeof InputWithSuggestionList>(styles)
class InputWithSuggestionList extends React.PureComponent<InputWithSuggestionListProps, InputWithSuggestionListState> {
  public constructor(props: InputWithSuggestionListProps) {
    super(props);

    this.state = {
      focus: -1,
      isOpen: false,
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
    const {
      wrapperStyle,
      listWrapperStyle,
      handleSubmit,
      iconNode,
      deleteIconNode,
      wrapperClassName,
      defaultValue,
      suggestionList,
      listItemStyle,
      DefaultItemComponent,
      ...inputProps
    } = this.props;
    const { inputValue, isOpen } = this.state;

    return (
      <ClickAwayListener onClickAway={this.handleCloseList}>
        <div>
          <div style={wrapperStyle} className={`${styles.inputWithListWrapper} ${wrapperClassName}`}>
            <input
              {...inputProps}
              onChange={this.handleChangeInput}
              onKeyDown={this.handleKeydown}
              onSubmit={() => {
                handleSubmit(inputValue);
              }}
              value={inputValue}
            />
            <span
              onClick={() => {
                handleSubmit(inputValue);
              }}
            >
              {iconNode}
            </span>
            <span
              onClick={() => {
                handleSubmit("");
              }}
            >
              {deleteIconNode}
            </span>
          </div>
          {isOpen && (
            <ul style={listWrapperStyle} className={styles.suggestionList}>
              {this.getHighlightedList()}
            </ul>
          )}
        </div>
      </ClickAwayListener>
    );
  }

  private handleCloseList = () => {
    this.setState(prevState => ({ ...prevState, isOpen: false }));
  };

  private getHighlightedList = () => {
    const { suggestionList, listItemStyle, handleSubmit, DefaultItemComponent } = this.props;
    const { highlightValue, focus } = this.state;

    const suggestions = suggestionList.map((suggestion, index) => {
      return (
        <li
          className={classNames({
            [styles.keywordCompletionItem]: focus !== index,
            [styles.highLightKeywordCompletionItem]: focus === index,
          })}
          onClick={() => {
            handleSubmit(suggestion);
            this.handleCloseList();
          }}
          style={listItemStyle}
          key={index}
          dangerouslySetInnerHTML={{
            __html: getHighlightedContent(suggestion, highlightValue),
          }}
        />
      );
    });

    if (DefaultItemComponent) {
      const isHighlighted = suggestions.length === 0 || focus === suggestions.length;
      return (
        <>
          {suggestions}
          <li
            className={classNames({
              [styles.keywordCompletionItem]: !isHighlighted,
              [styles.highLightKeywordCompletionItem]: isHighlighted,
            })}
          >
            <DefaultItemComponent
              userInput={highlightValue}
              onClick={() => {
                handleSubmit(highlightValue);
                this.handleCloseList();
              }}
            />
          </li>
        </>
      );
    }

    return suggestions;
  };

  private handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { suggestionList, handleSubmit, DefaultItemComponent } = this.props;
    const { focus, inputValue, highlightValue } = this.state;
    const maxFocusIndex = DefaultItemComponent ? suggestionList.length : suggestionList.length - 1;
    const minFocusIndex = -1;
    const nextFocusIndex = focus + 1 > maxFocusIndex ? -1 : focus + 1;
    const prevFocusIndex = focus - 1 < minFocusIndex ? maxFocusIndex : focus - 1;

    switch (e.keyCode) {
      case 13: {
        // enter
        e.preventDefault();
        this.handleCloseList();
        handleSubmit(inputValue);
        break;
      }

      case 9: // tab
      case 40: {
        // down
        e.preventDefault();
        this.setState(prevState => ({
          ...prevState,
          focus: nextFocusIndex,
          inputValue: suggestionList[nextFocusIndex] || highlightValue,
        }));
        break;
      }

      case 38: {
        // up
        e.preventDefault();
        this.setState(prevState => ({
          ...prevState,
          focus: prevFocusIndex,
          inputValue: suggestionList[prevFocusIndex] || highlightValue,
        }));
        break;
      }

      default:
        break;
    }
  };

  private handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const value = e.currentTarget.value;

    this.setState(prevState => ({
      ...prevState,
      inputValue: value,
      highlightValue: value,
      focus: -1,
      isOpen: value.length > 1,
    }));

    onChange && onChange(e);
  };
}

export default InputWithSuggestionList;
