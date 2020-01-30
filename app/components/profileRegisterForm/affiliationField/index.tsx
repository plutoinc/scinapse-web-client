import React, { FC } from 'react';
import { FormikProps, Field } from 'formik';
import { ProfileRegisterFormValues } from '..';
import { ProfileAffiliation } from '../../../model/profileAffiliation';
import { Affiliation } from '../../../model/affiliation';
import AffiliationSelectBox from '../../dialog/components/modifyProfile/affiliationSelectBox';
import classNames from 'classnames';
import { SuggestAffiliation } from '../../../api/suggest';
const s = require('../profileRegisterForm.scss');


function formatAffiliation(value?: Affiliation | SuggestAffiliation | string) {
  if (value && (value as Affiliation).name) {
    return (value as Affiliation).name;
  } else if (value && (value as SuggestAffiliation).keyword) {
    return (value as SuggestAffiliation).keyword;
  }
  return value;
}

const AffiliationInputField: FC<{ formikProps: FormikProps<ProfileRegisterFormValues>, profileAffiliation: ProfileAffiliation | null }> = props => {
  const { formikProps, profileAffiliation } = props;
  const { values, errors, touched, setFieldValue } = formikProps;

  if (profileAffiliation && (values.affiliation as Affiliation).id !== profileAffiliation.id) {
    const { id, name, nameAbbrev } = profileAffiliation;
    setFieldValue('affiliation', {
      id,
      name,
      nameAbbrev
    })
  }

  return (
    <div className={s.formRow}>
      <div className={s.formWrapper}>
        <label className={s.formLabel}>Affiliation</label>
        <Field
          name="affiliation"
          component={AffiliationSelectBox}
          placeholder="Affiliation"
          className={classNames({
            [s.inputForm]: true,
            [s.hasError]: !!errors.affiliation && !!touched.affiliation,
          })}
          errorWrapperClassName={s.affiliationErrorMsg}
          format={formatAffiliation}
          disabled
        />
      </div>
    </div>
  );
};

export default AffiliationInputField;
