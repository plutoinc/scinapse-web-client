import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import * as classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
import { getHighlightedContent } from '../../../helpers/highlightContent';
const styles = require('./inputWithSuggestionList.scss');

export interface DefaultItemComponentProps {
  userInput: string;
  onClick: () => void;
}

export interface SuggestionItem {
  text: string;
  removable?: boolean;
}

interface InputWithSuggestionListProps {
  suggestionList: SuggestionItem[];
  onSubmitQuery: (inputValue: string) => void;
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
  highlightedListItemIndex: number;
  isOpen: boolean;
  isLoading: boolean;
  inputValue: string;
  highlightValue: string;
}

@withStyles<typeof InputWithSuggestionList>(styles)
class InputWithSuggestionList extends React.PureComponent<
  InputWithSuggestionListProps & React.InputHTMLAttributes<HTMLInputElement>,
  InputWithSuggestionListState
> {
  public constructor(props: InputWithSuggestionListProps & React.InputHTMLAttributes<HTMLInputElement>) {
    super(props);

    this.state = {
      highlightedListItemIndex: -1,
      isOpen: false,
      isLoading: false,
      inputValue: props.defaultValue || '',
      highlightValue: '',
    };
  }

  public componentWillReceiveProps(nextProps: Readonly<InputWithSuggestionListProps>) {
    if (this.props.defaultValue !== nextProps.defaultValue) {
      this.setState(prevState => ({ ...prevState, inputValue: nextProps.defaultValue || '' }));
    }
  }

  public render() {
    const {
      wrapperStyle,
      listWrapperStyle,
      onSubmitQuery,
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
                onSubmitQuery(inputValue);
              }}
              value={inputValue}
            />
            <span
              onClick={() => {
                onSubmitQuery(inputValue);
              }}
            >
              {iconNode}
            </span>
            {inputValue && !inputProps.disabled ? (
              <span
                onClick={() => {
                  onSubmitQuery('');
                  this.handleCloseList();
                }}
              >
                {deleteIconNode}
              </span>
            ) : (
              ''
            )}
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
    const { suggestionList, listItemStyle, onSubmitQuery, DefaultItemComponent } = this.props;
    const { highlightValue, highlightedListItemIndex: focus } = this.state;

    const suggestions = suggestionList.map((suggestion, index) => {
      return (
        <li
          className={classNames({
            [styles.keywordCompletionItem]: focus !== index,
            [styles.highLightKeywordCompletionItem]: focus === index,
          })}
          onClick={() => {
            onSubmitQuery(suggestion.text);
            this.handleCloseList();
          }}
          style={listItemStyle}
          key={index}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: getHighlightedContent(suggestion.text, highlightValue),
            }}
          />
        </li>
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
                onSubmitQuery(highlightValue);
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
    const { suggestionList, onSubmitQuery, DefaultItemComponent } = this.props;
    const { highlightedListItemIndex: focus, inputValue, highlightValue, isOpen } = this.state;

    if (!suggestionList || suggestionList.length === 0) return;

    const maxFocusIndex = DefaultItemComponent ? suggestionList.length : suggestionList.length - 1;
    const minFocusIndex = -1;
    const nextFocusIndex = focus + 1 > maxFocusIndex ? -1 : focus + 1;
    const prevFocusIndex = focus - 1 < minFocusIndex ? maxFocusIndex : focus - 1;

    switch (e.keyCode) {
      case 13: {
        // enter
        e.preventDefault();
        this.handleCloseList();
        onSubmitQuery(inputValue);
        break;
      }

      case 9: // tab
      case 40: {
        // down
        if (isOpen) {
          e.preventDefault();
          this.setState(prevState => ({
            ...prevState,
            highlightedListItemIndex: nextFocusIndex,
            inputValue: (suggestionList[nextFocusIndex] && suggestionList[nextFocusIndex].text) || highlightValue,
          }));
        }
        break;
      }

      case 38: {
        // up
        e.preventDefault();
        this.setState(prevState => ({
          ...prevState,
          highlightedListItemIndex: prevFocusIndex,
          inputValue: (suggestionList[prevFocusIndex] && suggestionList[prevFocusIndex].text) || highlightValue,
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
      highlightedListItemIndex: -1,
      isOpen: value.length > 1,
    }));

    if (onChange) onChange(e);
  };
}

export default InputWithSuggestionList;
