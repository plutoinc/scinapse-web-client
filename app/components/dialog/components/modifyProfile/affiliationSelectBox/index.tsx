import * as React from "react";
import { debounce } from "lodash";
import { WrappedFieldProps } from "redux-form";
import SuggestAPI, { SuggestAffiliation } from "../../../../../api/suggest";
import { withStyles } from "../../../../../helpers/withStylesHelper";
import PlutoAxios from "../../../../../api/pluto";
import alertToast from "../../../../../helpers/makePlutoToastAction";
import * as classNames from "classnames";
const styles = require("./affiliationSelectBox.scss");

interface AffiliationSelectBoxProps extends WrappedFieldProps {
  inputClassName: string;
}

interface AffiliationSelectBoxState {
  isOpen: boolean;
  availableAffiliations: SuggestAffiliation[];
}

@withStyles<typeof AffiliationSelectBox>(styles)
class AffiliationSelectBox extends React.PureComponent<AffiliationSelectBoxProps, AffiliationSelectBoxState> {
  public constructor(props: AffiliationSelectBoxProps) {
    super(props);

    this.state = {
      isOpen: false,
      availableAffiliations: [],
    };
  }

  public render() {
    const { inputClassName, input, meta } = this.props;
    const { touched, error } = meta;
    const { value } = input;

    return (
      <div className={styles.inputWrapper}>
        <input
          value={value}
          className={classNames({
            [`${inputClassName}`]: true,
            [`${styles.error}`]: touched && error,
          })}
          onChange={this.handleInputChange}
        />
        {touched && error && <div className={styles.errorMessage}>{error}</div>}
        {this.getSelectBoxes()}
      </div>
    );
  }

  private closeSelectBox = () => {
    this.setState(prevState => ({ ...prevState, isOpen: false }));
  };

  private getSelectBoxes = () => {
    const { availableAffiliations, isOpen } = this.state;

    if (isOpen && availableAffiliations && availableAffiliations.length > 0) {
      const affiliationList = availableAffiliations.map(affiliation => {
        return (
          <li
            key={affiliation.affiliation_id}
            className={styles.selectBox}
            onMouseDown={() => {
              this.handleClickSelectBox(affiliation);
            }}
          >
            <div className={styles.contentBox}>{affiliation.keyword}</div>
          </li>
        );
      });
      return <div className={styles.selectBoxWrapper}>{affiliationList}</div>;
    }
    return null;
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

  private handleClickSelectBox = (affiliation: SuggestAffiliation) => {
    const { input } = this.props;
    const { onChange } = input;

    onChange(affiliation);
    this.closeSelectBox();
  };

  private searchAffiliation = async (query: string) => {
    try {
      const res = await SuggestAPI.getAffiliationSuggest(query);
      this.setState(prevState => ({ ...prevState, availableAffiliations: res.data.content || [] }));
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
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
