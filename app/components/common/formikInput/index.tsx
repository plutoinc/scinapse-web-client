import React from 'react';
import { FieldProps } from 'formik';
import { InputProps, InputField } from '@pluto_network/pluto-design-elements';

const FormikInput: React.FC<InputProps & FieldProps> = props => {
  const { field, form, ...inputProps } = props;
  const { touched, errors } = form;
  const error = errors[field.name] as string | undefined;
  const touch = touched[field.name] as boolean | undefined;

  return <InputField {...field} {...inputProps} error={touch && error ? error : ''} />;
};

export default FormikInput;
