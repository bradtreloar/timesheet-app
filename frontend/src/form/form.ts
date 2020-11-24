import { isEmpty } from "lodash";
import { useState } from "react";

export type FormValue = any;

export type FormValues<T> = T;

export type FormTouchedValues<T> = {
  [P in keyof T]?: boolean;
};

export type FormErrors<T> = {
  [P in keyof T]?: string;
};

export function useForm<T>(
  initialValues: FormValues<T>,
  onSubmit: (values: FormValues<T>) => void,
  validate: (values: FormValues<T>) => FormErrors<T>
) {
  const [values, setValues] = useState<FormValues<T>>(initialValues);
  const [touchedValues, setTouchedValues] = useState<FormTouchedValues<T>>({});
  const [errors, setErrors] = useState<FormErrors<T>>({});

  const getValue = (name: string) => values[name as keyof T];

  const setValue = (name: string, value: any) => {
    setValues(
      Object.assign({}, values, {
        [name]: value,
      })
    );
  };

  const setSomeValues = (someValues: any) => {
    setValues(Object.assign({}, values, someValues));
  };

  const getTouchedValue = (name: string): boolean => {
    const isTouched = touchedValues[name as keyof T];
    return isTouched ? true : false;
  };

  const setTouchedValue = (name: string, isTouched: boolean) => {
    setTouchedValues(
      Object.assign({}, touchedValues, {
        [name]: isTouched,
      })
    );
  };

  const setSomeTouchedValues = (someTouchedValues: any) => {
    setTouchedValues(Object.assign({}, touchedValues, someTouchedValues));
  };

  const getError = (name: string) => errors && errors[name as keyof T];

  const doValidate = () => {
    const errors = validate(values);
    setErrors(errors);
    return errors;
  };

  const handleChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setValue(name, value);
  };

  const handleBlur = (event: any) => {
    const target = event.target;
    const name = target.name;
    setTouchedValue(name, true);
    doValidate();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = doValidate();
    if (isEmpty(errors)) {
      onSubmit(values);
    }
  };

  return {
    values,
    touchedValues,
    errors,
    getValue,
    setValue,
    setSomeValues,
    getTouchedValue,
    setTouchedValue,
    setSomeTouchedValues,
    getError,
    handleBlur,
    handleChange,
    handleSubmit,
  };
}
