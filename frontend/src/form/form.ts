import { useState } from "react";

type FormValue = any;

type FormValues<T> = T;

type FormError = any;

type FormErrors = {
  [key: string]: FormError;
};

export function useForm<T>(
  initialValues: FormValues<T>,
  onSubmit: (values: FormValues<T>, errors: FormErrors) => void,
  validate: (values: FormValues<T>) => FormErrors
) {
  const [values, setValues] = useState<FormValues<T>>(initialValues);
  const [touchedValues, setTouchedValues] = useState<Partial<FormValues<T>>>(
    {}
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const doValidate = () => {
    const newErrors = validate(values);
    setErrors({
      ...errors,
      ...newErrors,
    });
    return newErrors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const target = event.target;
    const name = target.name;
    setTouchedValues({
      ...touchedValues,
      [name]: true,
    });
    doValidate();
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
    handleChange,
    handleSubmit,
    handleBlur,
  };
}
