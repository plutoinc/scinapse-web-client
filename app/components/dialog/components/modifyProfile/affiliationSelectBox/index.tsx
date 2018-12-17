import * as React from "react";
import { debounce } from "lodash";
import { FieldProps } from "formik";
import SuggestAPI, { SuggestAffiliation } from "../../../../../api/suggest";
import SuggestionList from "../../../../layouts/components/suggestionList";
import { withStyles } from "../../../../../helpers/withStylesHelper";
import PlutoAxios from "../../../../../api/pluto";
import alertToast from "../../../../../helpers/makePlutoToastAction";
import * as classNames from "classnames";
import Icon from "../../../../../icons";
import { Affiliation } from "../../../../../model/affiliation";
const styles = require("./affiliationSelectBox.scss");

interface AffiliationSelectBoxProps extends FieldProps {
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
    const { inputClassName, field, form } = this.props;
    const { touched, error } = form;
    const { isOpen, availableAffiliations } = this.state;
    const rawFieldValue = field.value as Affiliation | SuggestAffiliation | string;

    let displayValue: string = "";
    if (typeof rawFieldValue !== "string") {
      if (rawFieldValue && (rawFieldValue as Affiliation).name) {
        displayValue = (rawFieldValue as Affiliation).name || "";
      } else if (rawFieldValue && (rawFieldValue as SuggestAffiliation).keyword) {
        displayValue = (rawFieldValue as SuggestAffiliation).keyword;
      }
    } else {
      displayValue = rawFieldValue as string;
    }

    return (
      <div className={styles.affiliationSelectBox}>
        <div className={styles.inputWrapper}>
          <input
            value={displayValue}
            className={classNames({
              [`${inputClassName}`]: true,
              [`${styles.error}`]: touched && error,
            })}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeydown}
            placeholder="Current Affiliation"
          />
          <div className={styles.iconWrapper} onClick={this.handleClickDeleteButton}>
            <Icon icon="X_BUTTON" className={styles.deleteIcon} />
          </div>
          {touched && error && <div className={styles.errorMessage}>{error}</div>}
        </div>
        <SuggestionList
          userInput={displayValue}
          isOpen={isOpen}
          suggestionList={availableAffiliations.slice(0, 5).map(affiliation => affiliation.keyword)}
          isLoadingKeyword={false}
          handleClickSuggestionKeyword={this.handleClickSelectBox}
        />
      </div>
    );
  }

  private handleClickDeleteButton = () => {
    const { field, form } = this.props;
    form.setFieldValue(field.name, "");
    this.closeSelectBox();
  };

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
    const { form, field } = this.props;
    const newInput = e.currentTarget.value;
    form.setFieldValue(field.name, newInput);
    if (newInput.length > 1) {
      this.delayedGetKeywordCompletion(newInput);
      this.setState(prevState => ({ ...prevState, isOpen: true }));
    }
  };

  private handleClickSelectBox = (affiliationName: string) => {
    const { field, form } = this.props;
    const { availableAffiliations } = this.state;
    const targetAffiliation = availableAffiliations.find(affiliation => affiliation.keyword === affiliationName);

    console.log(field);
    console.log(form);
    // field.value(targetAffiliation);
    if (targetAffiliation) {
      // form.setValues(targetAffiliation);
      // onchange(targetAffiliation)
      form.setFieldValue(field.name, targetAffiliation);
    }
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
