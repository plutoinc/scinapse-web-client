import React from 'react';
import { FieldProps } from 'formik';
import { InputProps, InputField } from '@pluto_network/pluto-design-elements';

const FormikInput: React.FC<InputProps & FieldProps> = props => {
  const { field, form, ...inputProps } = props;
  const { touched, errors } = form;
  const error = errors[field.name] as string | undefined;

  return <InputField {...field} {...inputProps} error={touched && error} />;
};

export default FormikInput;
