import * as React from 'react';
import { debounce } from 'lodash';
import { FieldProps } from 'formik';
import * as classNames from 'classnames';
import SuggestAPI, { SuggestAffiliation } from '../../../../../api/suggest';
import { withStyles } from '../../../../../helpers/withStylesHelper';
import PlutoAxios from '../../../../../api/pluto';
import alertToast from '../../../../../helpers/makePlutoToastAction';
import Icon from '../../../../../icons';
import { Affiliation } from '../../../../../model/affiliation';
import InputWithSuggestionList, { DefaultItemComponentProps } from '../../../../common/InputWithSuggestionList';

const styles = require('./affiliationSelectBox.scss');

interface AffiliationSelectBoxProps extends FieldProps {
  className: string;
  disabled?: boolean;
  placeholder?: string;
  errorWrapperClassName: string;
}

interface AffiliationSelectBoxState {
  availableAffiliations: SuggestAffiliation[];
}

const DefaultItem: React.SFC<DefaultItemComponentProps> = props => {
  return (
    <div>
      {props.userInput.length > 0 && (
        <div
          onClick={() => {
            props.onClick();
          }}
          className={styles.enterAffiliationItemContext}
        >
          <Icon className={styles.plusIcon} icon="PLUS" />Enter <b>“{props.userInput}”</b> as your affiliation
        </div>
      )}
    </div>
  );
};

@withStyles<typeof AffiliationSelectBox>(styles)
class AffiliationSelectBox extends React.PureComponent<AffiliationSelectBoxProps, AffiliationSelectBoxState> {
  public constructor(props: AffiliationSelectBoxProps) {
    super(props);

    this.state = {
      availableAffiliations: [],
    };
  }

  public render() {
    const { field, form, className, disabled, errorWrapperClassName, placeholder } = this.props;
    const { touched, errors } = form;
    const { availableAffiliations } = this.state;
    const rawFieldValue = field.value as Affiliation | SuggestAffiliation | string;
    const error = errors[field.name];
    const touch = touched[field.name];

    const displayValue: string = this.getDisplayValue(rawFieldValue || '');

    return (
      <div className={styles.affiliationSelectBox}>
        <div className={styles.inputWrapper}>
          <InputWithSuggestionList
            disabled={disabled}
            defaultValue={displayValue}
            onChange={this.handleInputChange}
            placeholder={placeholder || 'Current Affiliation'}
            onSubmitQuery={this.handleClickSelectBox}
            suggestionList={availableAffiliations.slice(0, 5).map(affiliation => ({ text: affiliation.keyword }))}
            className={classNames({
              [className]: true,
              [styles.error]: !!touch && !!error,
            })}
            listItemStyle={{
              height: '30px',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              padding: '8px',
              fontSize: '13px',
              whiteSpace: 'nowrap',
            }}
            listWrapperStyle={{
              zIndex: 3,
              top: '40px',
              borderRadius: '5px',
              boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px 1px',
            }}
            DefaultItemComponent={DefaultItem}
            deleteIconNode={
              <Icon icon="X_BUTTON" className={styles.deleteIcon} onClick={this.handleClickDeleteButton} />
            }
          />
          {touch &&
            error && (
              <div
                className={classNames({
                  [styles.errorMessage]: !errorWrapperClassName,
                  [errorWrapperClassName]: !!errorWrapperClassName,
                })}
              >
                {error}
              </div>
            )}
        </div>
      </div>
    );
  }

  private checkedRawFieldValueType = (rawFieldValue: Affiliation | SuggestAffiliation | string) => {
    if (typeof rawFieldValue === 'string') {
      return 'string';
    }

    if (typeof (rawFieldValue as Affiliation).name !== 'undefined') {
      return 'Affiliation';
    }

    return 'SuggestAffiliation';
  };

  private getDisplayValue = (rawFieldValue: Affiliation | SuggestAffiliation | string): string => {
    switch (this.checkedRawFieldValueType(rawFieldValue)) {
      case 'string':
        return rawFieldValue as string;
      case 'Affiliation':
        return (rawFieldValue as Affiliation).name || '';
      case 'SuggestAffiliation':
        return (rawFieldValue as SuggestAffiliation).keyword;

      default:
        return '';
    }
  };

  private handleClickDeleteButton = () => {
    const { field, form } = this.props;
    form.setFieldValue(field.name, '');
  };

  private handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { form, field } = this.props;
    const newInput = e.currentTarget.value;
    const customAffiliation: Affiliation = { id: null, name: newInput, nameAbbrev: null };

    form.setFieldTouched(field.name);
    form.setFieldValue(field.name, customAffiliation);

    if (newInput.length > 1) {
      this.delayedGetKeywordCompletion(newInput);
    }
  };

  private handleClickSelectBox = (affiliationName: string) => {
    const { field, form } = this.props;
    const { availableAffiliations } = this.state;
    const targetAffiliation = availableAffiliations.find(affiliation => affiliation.keyword === affiliationName);

    if (!targetAffiliation && affiliationName) {
      const customAffiliation: Affiliation = { id: null, name: affiliationName, nameAbbrev: null };
      form.setFieldValue(field.name, customAffiliation);
    } else if (targetAffiliation) {
      form.setFieldValue(field.name, targetAffiliation);
    }
  };

  private searchAffiliation = async (query: string) => {
    this.setState(prevState => ({ ...prevState, isLoading: true }));

    try {
      const res = await SuggestAPI.getAffiliationSuggest(query);
      this.setState(prevState => ({
        ...prevState,
        isLoading: false,
        availableAffiliations: res.data.content || [],
      }));
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      this.setState(prevState => ({ ...prevState, isLoading: false }));
      alertToast({
        type: 'error',
        message: 'Had error to get auto-completion affiliation keyword',
      });
    }
  };

  // tslint:disable-next-line:member-ordering
  private delayedGetKeywordCompletion = debounce(this.searchAffiliation, 150);
}

export default AffiliationSelectBox;
