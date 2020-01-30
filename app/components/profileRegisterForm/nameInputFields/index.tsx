import React, {FC} from 'react';
import { Field } from 'formik';
const s = require('../profileRegisterForm.scss');

const NameInputFields: FC = () => (
  <div className={s.formRow}>
    <div className={s.formWrapper}>
      <label className={s.formLabel}>First Name</label>
      <Field name="firstName" placeholder="First Name" className={s.inputForm} />
    </div>
    <div className={s.formWrapper}>
      <label className={s.formLabel}>Last Name</label>
      <Field name="lastName" placeholder="Last Name" className={s.inputForm} />
    </div>
  </div>
);

export default NameInputFields;
