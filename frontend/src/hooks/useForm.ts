import { forOwn, isEmpty } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

export type FormValue = any;

export type FormValues<T> = T;

export type FormTouchedValues<T> = {
  [P in keyof T]?: boolean;
};

export type FormErrors<T> = {
  [key: string]: string;
};

export type FormVisibleErrors<T> = {
  [P in keyof T]?: boolean;
};

const useForm = <T>(
  initialValues: FormValues<T>,
  onSubmit: (values: FormValues<T>) => void,
  validate: (values: FormValues<T>) => FormErrors<T>
) => {
  const [values, setValues] = useState<FormValues<T>>(initialValues);
  const [touchedValues, setTouchedValues] = useState<FormTouchedValues<T>>({});
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const visibleErrors = useMemo(() => {
    const visibleErrors = {} as FormVisibleErrors<T>;

    forOwn(errors, (error, name) => {
      if (
        submitAttempted ||
        touchedValues[name as keyof FormTouchedValues<T>] === true
      ) {
        visibleErrors[name as keyof FormVisibleErrors<T>] = true;
      }
    });

    return visibleErrors;
  }, [errors, touchedValues, submitAttempted]);

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

  const doValidate = useCallback(() => {
    const errors = validate(values);
    setErrors(errors);
    return errors;
  }, [values, validate]);

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
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);
    const errors = doValidate();
    if (isEmpty(errors)) {
      onSubmit(values);
    }
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValues(initialValues);
    setErrors({});
    setSubmitAttempted(false);
  };

  useEffect(() => {
    doValidate();
  }, [values, doValidate]);

  return {
    values,
    touchedValues,
    errors,
    visibleErrors,
    submitAttempted,
    setValue,
    setSomeValues,
    setTouchedValue,
    setSomeTouchedValues,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
  };
};

export default useForm;
