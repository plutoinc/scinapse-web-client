import * as React from "react";
import { debounce } from "lodash";
import { WrappedFieldProps } from "redux-form";
import SuggestAPI, { SuggestAffiliation } from "../../../../../api/suggest";
import SuggestionList from "../../../../layouts/components/suggestionList";
import { withStyles } from "../../../../../helpers/withStylesHelper";
import PlutoAxios from "../../../../../api/pluto";
import alertToast from "../../../../../helpers/makePlutoToastAction";
import * as classNames from "classnames";
import Icon from "../../../../../icons";
const styles = require("./affiliationSelectBox.scss");

interface AffiliationSelectBoxProps extends WrappedFieldProps {
  inputClassName: string;
}

interface AffiliationSelectBoxState {
  isOpen: boolean;
  isLoading: boolean;
  availableAffiliations: SuggestAffiliation[];
}

@withStyles<typeof AffiliationSelectBox>(styles)
class AffiliationSelectBox extends React.PureComponent<AffiliationSelectBoxProps, AffiliationSelectBoxState> {
  public constructor(props: AffiliationSelectBoxProps) {
    super(props);

    this.state = {
      isOpen: false,
      isLoading: false,
      availableAffiliations: [],
    };
  }

  public render() {
    const { inputClassName, input, meta } = this.props;
    const { touched, error } = meta;
    const { value } = input;
    const { isOpen, availableAffiliations } = this.state;

    return (
      <div className={styles.affiliationSelectBox}>
        <div className={styles.inputWrapper}>
          <input
            value={value}
            className={classNames({
              [`${inputClassName}`]: true,
              [`${styles.error}`]: touched && error,
            })}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeydown}
          />
          <Icon icon="ARROW_POINT_TO_DOWN" className={styles.arrowIcon} />
          {touched && error && <div className={styles.errorMessage}>{error}</div>}
        </div>
        <SuggestionList
          userInput={value}
          isOpen={isOpen}
          suggestionList={availableAffiliations.slice(0, 5).map(affiliation => affiliation.keyword)}
          isLoadingKeyword={false}
          handleClickSuggestionKeyword={this.handleClickSelectBox}
        />
      </div>
    );
  }

  private closeSelectBox = () => {
    this.setState(prevState => ({ ...prevState, isOpen: false }));
  };

  private handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 40) {
      e.preventDefault();

      const target: any =
        e.currentTarget.parentNode &&
        e.currentTarget.parentNode.nextSibling &&
        e.currentTarget.parentNode.nextSibling.firstChild;

      if (target) {
        target.focus();
      }
    }
  };

  private handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { input } = this.props;
    const newInput = e.currentTarget.value;

    input.onChange(newInput);
    if (newInput.length > 1) {
      this.delayedGetKeywordCompletion(newInput);
      this.setState(prevState => ({ ...prevState, isOpen: true }));
    }
  };

  private handleClickSelectBox = (affiliationName: string) => {
    const { input } = this.props;
    const { availableAffiliations } = this.state;
    const { onChange } = input;

    const targetAffiliation = availableAffiliations.find(affiliation => affiliation.keyword === affiliationName);

    onChange(targetAffiliation);
    this.closeSelectBox();
  };

  private searchAffiliation = async (query: string) => {
    this.setState(prevState => ({ ...prevState, isLoading: true }));

    try {
      const res = await SuggestAPI.getAffiliationSuggest(query);
      this.setState(prevState => ({ ...prevState, isLoading: false, availableAffiliations: res.data.content || [] }));
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      this.setState(prevState => ({ ...prevState, isLoading: false }));
      alertToast({
        type: "error",
        message: "Had error to get auto-completion affiliation keyword",
      });
    }
  };

  // tslint:disable-next-line:member-ordering
  private delayedGetKeywordCompletion = debounce(this.searchAffiliation, 300);
}

export default AffiliationSelectBox;
