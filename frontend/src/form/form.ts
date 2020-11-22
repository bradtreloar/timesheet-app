import { isEqual } from "lodash";
import { useState } from "react";

type FormValue = any;

type FormValues<T> = T;

type FormTouchedValues<T> = {
  [P in keyof T]?: boolean;
};

type FormErrors<T> = {
  [P in keyof T]?: string;
};

export function useForm<T>(
  initialValues: FormValues<T>,
  onSubmit: (values: FormValues<T>, errors: FormErrors<T>) => void,
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

  const getError = (name: string) => errors[name as keyof T];

  const hasErrors = () => !isEqual(errors, {});

  const doValidate = () => {
    const newErrors = validate(values);
    setErrors({
      ...errors,
      ...newErrors,
    });
    return newErrors;
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

  const handleRemoveFormControl = (name: string) => {
    setTouchedValue(name, false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = doValidate();
    onSubmit(values, newErrors);
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
    hasErrors,
    handleBlur,
    handleChange,
    handleRemoveFormControl,
    handleSubmit,
  };
}
